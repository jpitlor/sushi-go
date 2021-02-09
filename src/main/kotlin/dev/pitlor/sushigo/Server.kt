package dev.pitlor.sushigo

import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller

val games = arrayListOf<Game>()

data class CreateGameRequest(val code: String)
data class CreateGameResponse(val games: List<String>)

@Controller
class ServerController {
    @MessageMapping("/games/create")
    @SendTo("/topic/games")
    fun createGame(request: CreateGameRequest): CreateGameResponse {
        require(request.code.isNotEmpty()) { "Code is empty" }
        require(games.firstOrNull { it.code === request.code } == null) { "That game code is already in use" }
        games += Game(request.code)

        return CreateGameResponse(games.map { it.code })
    }
}

