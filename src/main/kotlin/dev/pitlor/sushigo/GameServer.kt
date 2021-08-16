package dev.pitlor.sushigo

import dev.pitlor.gamekit_spring_boot_starter.SETTING_CONNECTED
import dev.pitlor.gamekit_spring_boot_starter.Server
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.LocalDateTime
import java.util.*

val games = arrayListOf<SushiGoGame>()
val mutex = Mutex()

object SushiGoServer : Server {
    private fun getPlayer(code: String, user: UUID): Pair<Player, SushiGoGame> {
        val game = games.find { it.code == code }
        val player = game?.players?.find { it.id == user }

        require(code.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(player != null) { "That player is not in this game" }

        return Pair(player, game)
    }

    override fun getGameCodes(): List<String> {
        return games.filter { !it.active }.map { it.code }
    }

    override fun getGame(gameCode: String): SushiGoGame {
        val game = games.find { it.code == gameCode }

        require(game != null) { "That game does not exist" }

        return game
    }

    override fun createGame(code: String, user: UUID): String {
        require(code.isNotEmpty()) { "Code is empty" }
        require(games.firstOrNull { it.code == code } == null) { "That game code is already in use" }

        games += SushiGoGame(code, user)

        return "Game \"${code}\" Created"
    }

    override fun joinGame(gameCode: String, userId: UUID, settings: MutableMap<String, Any>) {
        val game = games.find { it.code == gameCode }

        require(gameCode.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(game.players.find { it.id == userId } == null) { "You are already in that game!" }

        settings[SETTING_CONNECTED] = true
        val player = Player(userId, settings)
        game.players += player
    }

    override fun updateSettings(gameCode: String, userId: UUID, newSettings: MutableMap<String, Any>) {
        val (player, _) = getPlayer(gameCode, userId)

        player.settings.putAll(newSettings)

        if (newSettings[SETTING_CONNECTED] == true) {
            player.startOfTimeOffline = null
        } else if (newSettings[SETTING_CONNECTED] == false) {
            player.startOfTimeOffline = LocalDateTime.now()
        }
    }

    override fun findCodeOfGameWithPlayer(id: UUID): String? {
        return games
            .find { g ->
                val isGameOver = g.round == 3 && g.players.all { p -> p.hand.size == 0 }
                !isGameOver && g.players.any { p -> p.id == id }
            }
            ?.code
    }

    fun startRound(code: String, id: UUID) {
        val (_, game) = getPlayer(code, id)

        require(game.admin == id) { "You are not the admin of this game" }

        game.startRound()
    }

    fun startPlay(code: String, id: UUID) {
        val (_, game) = getPlayer(code, id)

        require(game.admin == id) { "You are not the admin of this game" }

        game.startPlay()
    }

    fun playCards(code: String, user: UUID, request: List<PlayCardRequest>): String {
        val (player, game) = getPlayer(code, user)

        require(request.size == 1 || request.size == 2) { "Invalid number of cards" }
        require(request.size == 1 || player.cardsPlayed.any { it is Chopsticks }) { "You can only play 2 cards if you have previously played chopsticks" }
        require(request.all { it.wasabi == null || player.cardsPlayed.find { c -> c is Wasabi && c.nigiri == null && c.id == it.wasabi } != null }) { "You don't have enough empty Wasabi for this move" }

        game.playCard(user, request)

        return "Play successfully completed"
    }

    override suspend fun becomeAdmin(gameCode: String, userId: UUID): String {
        val (_, game) = getPlayer(gameCode, userId)

        mutex.withLock {
            check(game.players.find { it.id == game.admin }?.startOfTimeOffline == null) { "Someone already claimed the admin spot" }
            game.admin = userId
        }

        return "You are now the game admin"
    }
}
