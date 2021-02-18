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

    fun createGame(code: String, user: UUID): String {
        require(code.isNotEmpty()) { "Code is empty" }
        require(games.firstOrNull { it.code == code } == null) { "That game code is already in use" }

        games += Game(code, user)

        return "Game \"${code}\" Created"
    }

    fun joinGame(code: String, user: UUID, settings: PlayerSettings) {
        val gameIndex = games.indexOfFirst { it.code == code }

        require(code.isNotEmpty()) { "Code is empty" }
        require(gameIndex > -1) { "That game does not exist" }
        require(games[gameIndex].players.find { it.id == user } == null) { "You are already in that game!" }

        val player = Player(user, settings)
        games[gameIndex].players += player
    }

    fun updateSettings(code: String, user: UUID, settings: PlayerSettings) {
        val gameIndex = games.indexOfFirst { it.code == code }
        require(code.isNotEmpty()) { "Code is empty" }
        require(gameIndex > -1) { "That game does not exist" }

        val playerIndex = games[gameIndex].players.indexOfFirst { it.id == user }
        require(playerIndex > -1) { "That player is not in this game" }

        games[gameIndex].players[playerIndex].settings = settings
    }
}

