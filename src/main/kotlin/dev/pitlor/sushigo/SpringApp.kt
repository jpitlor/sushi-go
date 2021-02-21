package dev.pitlor.sushigo

import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.kotlinModule
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.event.EventListener
import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.handler.annotation.*
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.annotation.SendToUser
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.messaging.simp.config.ChannelRegistration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.ChannelInterceptor
import org.springframework.messaging.support.MessageHeaderAccessor
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer
import org.springframework.web.socket.messaging.SessionConnectEvent
import org.springframework.web.socket.messaging.SessionDisconnectEvent
import java.security.Principal
import java.util.*

data class User(val id: UUID) : Principal {
    override fun getName(): String {
        return id.toString()
    }
}

@ControllerAdvice
class CustomPrincipal {
    @ModelAttribute
    fun getPrincipal(a: Authentication): User {
        return a.principal as User
    }
}

@Configuration
@EnableWebSecurity
open class Security : WebSecurityConfigurerAdapter() {
    override fun configure(http: HttpSecurity) {
        http.authorizeRequests().anyRequest().permitAll()
    }
}

@Configuration
@EnableWebSocketMessageBroker
open class SocketConfig : WebSocketMessageBrokerConfigurer {
    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        registry.enableSimpleBroker("/topic")
        registry.setApplicationDestinationPrefixes("/app", "/topic")
    }

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.addEndpoint("/").setAllowedOriginPatterns("*").withSockJS()
    }

    override fun configureClientInboundChannel(registration: ChannelRegistration) {
        registration.interceptors(object : ChannelInterceptor {
            override fun preSend(message: Message<*>, channel: MessageChannel): Message<*> {
                val accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor::class.java)
                if (accessor.command == StompCommand.CONNECT) {
                    val uuid = accessor.getNativeHeader("uuid")?.get(0)
                    accessor.user = User(UUID.fromString(uuid))
                }

                return message
            }
        })
    }
}

@Bean
fun getJacksonKotlinModule(): KotlinModule {
    return kotlinModule()
}

@Controller
class ServerController(private val socket: SimpMessagingTemplate) {
    private val server = Server()

    @EventListener
    fun onConnect(e: SessionConnectEvent) {
        val user = e.user as User
        server.findPlayer(user.id)?.let {
            server.updateSettings(it, user.id, mutableMapOf(SETTING_CONNECTED to true))
            socket.convertAndSend("/topic/games/$it", server.getGame(it))
        }
    }

    @EventListener
    fun onDisconnect(e: SessionDisconnectEvent) {
        val user = e.user as User
        server.findPlayer(user.id)?.let {
            server.updateSettings(it, user.id, mutableMapOf(SETTING_CONNECTED to false))
            socket.convertAndSend("/topic/games/$it", server.getGame(it))
        }
    }

    @MessageExceptionHandler
    @SendToUser("/topic/errors/client")
    fun on400Error(e: IllegalArgumentException): String {
        return e.message ?: ""
    }

    @MessageExceptionHandler
    @SendToUser("/topic/errors/server")
    fun on500Error(e: IllegalStateException): String {
        return e.message ?: ""
    }

    @SubscribeMapping("/rejoin-game")
    fun findLastGame(@ModelAttribute user: User): String? {
        return server.findPlayer(user.id)
    }

    @SubscribeMapping("/games")
    fun getGames(): Iterable<String> {
        return server.getGames()
    }

    @SubscribeMapping("/games/{gameCode}")
    fun getGame(@DestinationVariable gameCode: String): Game {
        return server.getGame(gameCode)
    }

    @MessageMapping("/games/{gameCode}/create")
    @SendToUser("/topic/successes")
    fun createGame(@DestinationVariable gameCode: String, @ModelAttribute user: User): String {
        val response = server.createGame(gameCode, user.id)
        socket.convertAndSend("/topic/games", server.getGames())
        return response
    }

    @MessageMapping("/games/{gameCode}/join")
    @SendTo("/topic/games/{gameCode}")
    fun joinGame(
        @DestinationVariable gameCode: String,
        @Payload settings: MutableMap<String, Any>,
        @ModelAttribute user: User
    ): Game {
        server.joinGame(gameCode, user.id, settings)
        return server.getGame(gameCode)
    }

    @MessageMapping("/games/{gameCode}/update")
    @SendTo("/topic/games/{gameCode}")
    fun updateSettings(
        @DestinationVariable gameCode: String,
        @Payload settings: MutableMap<String, Any>,
        @ModelAttribute user: User
    ): Game {
        server.updateSettings(gameCode, user.id, settings)
        return server.getGame(gameCode)
    }

    @MessageMapping("/games/{gameCode}/start-round")
    @SendTo("/topic/games/{gameCode}")
    fun startRound(@DestinationVariable gameCode: String, @ModelAttribute user: User): Game {
        server.startRound(gameCode, user.id)
        socket.convertAndSend("/topic/games", server.getGames())
        return server.getGame(gameCode)
    }
}

@SpringBootApplication
open class SushiGoServer

fun main(args: Array<String>) {
    runApplication<SushiGoServer>(*args)
}