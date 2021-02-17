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
        val game = games.find { it.code == code }

        require(code.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(game.players.find { it.id == user } == null) { "You are already in that game!" }

        val player = Player(user, settings)
        game.players += player
    }

    fun updateSettings(code: String, user: UUID, settings: PlayerSettings) {
        val game = games.find { it.code == code }
        val player = game?.players?.find { it.id == user }

        require(code.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(player != null) { "That player is not in this game" }

        player.settings = settings
    }
}

