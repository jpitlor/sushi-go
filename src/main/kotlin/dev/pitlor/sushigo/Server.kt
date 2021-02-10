package dev.pitlor.sushigo

import org.springframework.messaging.handler.annotation.MessageExceptionHandler
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.annotation.SendToUser
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.stereotype.Controller


val games = arrayListOf<Game>()

data class CreateGameRequest(val code: String)
data class CreateGameResponse(val games: List<String>)
data class ErrorResponse(val message: String)

@Controller
class ServerController() {
    @MessageExceptionHandler
    @SendToUser("/topic/errors/client")
    fun on400Error(e: IllegalArgumentException): ErrorResponse {
        return ErrorResponse(e.message ?: "")
    }

    @MessageExceptionHandler
    @SendToUser("/topic/errors/server")
    fun on500Error(e: IllegalStateException): ErrorResponse {
        return ErrorResponse(e.message ?: "")
    }

    @SubscribeMapping("/topic/games")
    fun getGames(): CreateGameResponse {
        return CreateGameResponse(games.map { it.code })
    }

    @MessageMapping("/games/create")
    @SendTo("/topic/games")
    fun createGame(request: CreateGameRequest): CreateGameResponse {
        require(request.code.isNotEmpty()) { "Code is empty" }
        require(games.firstOrNull { it.code == request.code } == null) { "That game code is already in use" }
        games += Game(request.code)

        return CreateGameResponse(games.map { it.code })
    }
}

