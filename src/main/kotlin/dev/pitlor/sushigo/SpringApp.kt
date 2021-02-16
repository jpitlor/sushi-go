package dev.pitlor.sushigo

import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.kotlinModule
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.handler.annotation.MessageExceptionHandler
import org.springframework.messaging.handler.annotation.MessageMapping
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

                return message;
            }
        })
    }
}

@Bean
fun getJacksonKotlinModule(): KotlinModule {
    return kotlinModule()
}

data class CreateGameRequest(val code: String)
data class CreateGameResponse(val games: Iterable<String>)
data class NotificationResponse(val message: String)

@Controller
class ServerController(private val template: SimpMessagingTemplate) {
    private val server = Server()

    @MessageExceptionHandler
    @SendToUser("/topic/errors/client")
    fun on400Error(e: IllegalArgumentException): NotificationResponse {
        return NotificationResponse(e.message ?: "")
    }

    @MessageExceptionHandler
    @SendToUser("/topic/errors/server")
    fun on500Error(e: IllegalStateException): NotificationResponse {
        return NotificationResponse(e.message ?: "")
    }

    @SubscribeMapping("/games")
    fun getGames(): CreateGameResponse {
        return CreateGameResponse(server.getGames())
    }

    @MessageMapping("/games/create")
    @SendToUser("/topic/successes")
    fun createGame(request: CreateGameRequest, sha: SimpMessageHeaderAccessor): NotificationResponse {
        val response = server.createGame(request.code)
        template.convertAndSend("/topic/games", CreateGameResponse(server.getGames()))
        return NotificationResponse(response)
    }

    @MessageMapping("/games/{gameCode}/join")
    fun joinGame() {

    }
}

@SpringBootApplication
open class SushiGoServer

fun main(args: Array<String>) {
    runApplication<SushiGoServer>(*args)
}