package dev.pitlor.sushigo

import org.springframework.messaging.handler.annotation.MessageExceptionHandler
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.annotation.SendToUser
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.stereotype.Controller

val games = arrayListOf<Game>()

data class CreateGameRequest(val code: String)
data class CreateGameResponse(val games: List<String>)
data class NotificationResponse(val message: String)

@Controller
class ServerController(private val template: SimpMessagingTemplate) {
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
        return CreateGameResponse(games.map { it.code })
    }

    @MessageMapping("/games/create")
    @SendToUser("/topic/successes")
    fun createGame(request: CreateGameRequest): NotificationResponse {
        require(request.code.isNotEmpty()) { "Code is empty" }
        require(games.firstOrNull { it.code == request.code } == null) { "That game code is already in use" }

        games += Game(request.code)
        template.convertAndSend("/topic/games", CreateGameResponse(games.map { it.code }))

        return NotificationResponse("Game \"${request.code}\" Created")
    }
}

