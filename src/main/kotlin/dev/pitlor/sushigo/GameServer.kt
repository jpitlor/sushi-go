package dev.pitlor.sushigo

import java.util.*

val games = arrayListOf<Game>()

class Server {
    fun getGames(): Iterable<String> {
        return games.map { it.code }
    }

    fun getGame(gameCode: String): Game {
        val game = games.find { it.code == gameCode }

        require(game != null) { "That game does not exist" }

        return game
    }

    fun createGame(code: String): String {
        require(code.isNotEmpty()) { "Code is empty" }
        require(games.firstOrNull { it.code == code } == null) { "That game code is already in use" }

        games += Game(code)

        return "Game \"${code}\" Created"
    }

    fun joinGame(code: String, user: UUID, settings: PlayerSettings) {

    }

    fun updateSettings(code: String, user: UUID, settings: PlayerSettings) {

    }
}

