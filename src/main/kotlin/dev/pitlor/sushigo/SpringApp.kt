package dev.pitlor.sushigo

import dev.pitlor.gamekit_spring_boot_starter.User
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.annotation.SendToUser
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.ModelAttribute
import java.util.*

data class PlayCardRequest(val card: Card, val wasabi: UUID?)

@Controller
class ServerController(private val server: SushiGoServer, private val socket: SimpMessagingTemplate) {
    @MessageMapping("/games/{gameCode}/start-round")
    @SendTo("/topic/games/{gameCode}")
    fun startRound(@DestinationVariable gameCode: String, @ModelAttribute user: User): SushiGoGame {
        server.startRound(gameCode, user.id)
        socket.convertAndSend("/topic/games", server.getGameCodes())
        return server.getGame(gameCode)
    }

    @MessageMapping("/games/{gameCode}/start-play")
    @SendTo("/topic/games/{gameCode}")
    fun startPlay(@DestinationVariable gameCode: String, @ModelAttribute user: User): SushiGoGame {
        server.startPlay(gameCode, user.id)
        return server.getGame(gameCode)
    }

    @MessageMapping("/games/{gameCode}/play-cards")
    @SendToUser("/topic/successes")
    fun playCards(
        @DestinationVariable gameCode: String,
        @ModelAttribute user: User,
        @Payload request: List<PlayCardRequest>
    ): String {
        val response = server.playCards(gameCode, user.id, request)
        socket.convertAndSend("/topic/games/$gameCode", server.getGame(gameCode))
        return response
    }
}

@Configuration
open class Dependencies {
    @Bean
    open fun sushiGoServer(): SushiGoServer {
        return SushiGoServer
    }
}

@SpringBootApplication
open class SushiGoApplication

fun main(args: Array<String>) {
    runApplication<SushiGoApplication>(*args)
}