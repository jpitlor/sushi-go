package dev.pitlor.sushigo

import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.kotlinModule
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageExceptionHandler
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.annotation.SendToUser
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.messaging.simp.config.ChannelRegistration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.ChannelInterceptor
import org.springframework.messaging.support.MessageHeaderAccessor
import org.springframework.stereotype.Controller
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer
import java.security.Principal
import java.util.*

class User(private val id: UUID, var userName: String) : Principal {
    override fun getName(): String {
        return id.toString()
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
        registration.interceptors(object: ChannelInterceptor {
            override fun preSend(message: Message<*>, channel: MessageChannel): Message<*> {
                val accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor::class.java)
                if (accessor.command == StompCommand.CONNECT) {
                    accessor.user = Principal { accessor.getNativeHeader("uuid")?.get(0) }
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
class ServerController(private val template: SimpMessagingTemplate) {
    private val server = Server()

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
    fun createGame(@DestinationVariable gameCode: String, sha: SimpMessageHeaderAccessor): String {
        val user = UUID.fromString(sha.user?.name ?: "")
        val response = server.createGame(gameCode, user)
        template.convertAndSend("/topic/games", server.getGames())
        return response
    }

    @MessageMapping("/games/{gameCode}/join")
    @SendTo("/topic/games/{gameCode}")
    fun joinGame(@DestinationVariable gameCode: String, settings: PlayerSettings, sha: SimpMessageHeaderAccessor): Game {
        val user = UUID.fromString(sha.user?.name ?: "")
        server.joinGame(gameCode, user, settings)
        return server.getGame(gameCode)
    }

    @MessageMapping("/games/{gameCode}/update")
    @SendTo("/topic/games/{gameCode}")
    fun updateSettings(@DestinationVariable gameCode: String, settings: PlayerSettings, sha: SimpMessageHeaderAccessor): Game {
        val user = UUID.fromString(sha.user?.name ?: "")
        server.updateSettings(gameCode, user, settings)
        return server.getGame(gameCode)
    }
}

@SpringBootApplication
open class SushiGoServer

fun main(args: Array<String>) {
    runApplication<SushiGoServer>(*args)
}