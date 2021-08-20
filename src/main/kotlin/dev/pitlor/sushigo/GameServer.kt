package dev.pitlor.sushigo

import dev.pitlor.gamekit_spring_boot_starter.implementations.Server
import dev.pitlor.gamekit_spring_boot_starter.interfaces.IGame
import dev.pitlor.gamekit_spring_boot_starter.interfaces.IGameRepository
import dev.pitlor.gamekit_spring_boot_starter.interfaces.IPlayer
import kotlinx.coroutines.sync.Mutex
import org.springframework.stereotype.Component
import java.util.*

val games = arrayListOf<SushiGoGame>()
val mutex = Mutex()

@Component
class SushiGoServer(
    gameRepository: IGameRepository,
    gameFactory: (code: String, adminId: UUID) -> IGame,
    playerFactory: (id: UUID, settings: MutableMap<String, Any>) -> IPlayer
) : Server(gameRepository, gameFactory, playerFactory) {
    private fun getPlayer(code: String, user: UUID): Pair<Player, SushiGoGame> {
        val game = games.find { it.code == code }
        val player = game?.players?.find { it.id == user }

        require(code.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(player != null) { "That player is not in this game" }

        return Pair(player, game)
    }

    fun startRound(code: String, id: UUID) {
        val (_, game) = getPlayer(code, id)

        require(game.adminId == id) { "You are not the admin of this game" }

        game.startRound()
    }

    fun startPlay(code: String, id: UUID) {
        val (_, game) = getPlayer(code, id)

        require(game.adminId == id) { "You are not the admin of this game" }

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
}
