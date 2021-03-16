package dev.pitlor.sushigo

import java.util.*

val games = arrayListOf<Game>()

class Server {
    fun getGames(): Iterable<String> {
        return games.filter { !it.active }.map { it.code }
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

    fun joinGame(code: String, user: UUID, settings: MutableMap<String, Any>) {
        val game = games.find { it.code == code }

        require(code.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(game.players.find { it.id == user } == null) { "You are already in that game!" }

        settings[SETTING_CONNECTED] = true
        val player = Player(user, settings)
        game.players += player
    }

    fun updateSettings(code: String, user: UUID, settings: MutableMap<String, Any>) {
        val game = games.find { it.code == code }
        val player = game?.players?.find { it.id == user }

        require(code.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(player != null) { "That player is not in this game" }

        player.settings.putAll(settings)
    }

    fun findPlayer(user: UUID): String? {
        return games.find { g -> g.players.any { p -> p.id == user } }?.code
    }

    fun startRound(code: String, id: UUID) {
        val game = games.find { it.code == code }

        require(code.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(game.admin == id) { "You are not the admin of this game" }

        game.startRound()
    }

    fun startPlay(code: String, id: UUID) {
        val game = games.find { it.code == code }

        require(code.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(game.admin == id) { "You are not the admin of this game" }

        game.startPlay()
    }

    fun playCards(code: String, user: UUID, request: List<PlayCardRequest>): String {
        val game = games.find { it.code == code }
        val player = game?.players?.find { it.id == user }

        require(code.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(player != null) { "That player is not in this game" }
        require(request.size == 1 || request.size == 2) { "Invalid number of cards" }
        require(request.size == 1 || player.cardsPlayed.any { it is Chopsticks }) { "You can only play 2 cards if you have previously played chopsticks" }
        require(request.all { it.wasabi == null || player.cardsPlayed.find { c -> c is Wasabi && c.nigiri == null && c.id == it.wasabi } != null }) { "You don't have enough empty Wasabi for this move" }

        game.playCard(user, request)

        return "Play successfully completed"
    }
}

