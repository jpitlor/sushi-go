package dev.pitlor.sushigo

import dev.pitlor.gamekit_spring_boot_starter.implementations.Server
import dev.pitlor.gamekit_spring_boot_starter.interfaces.IGameRepository
import dev.pitlor.gamekit_spring_boot_starter.interfaces.IServer
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import java.util.*

@Service
class SushiGoServer(
    val gameRepository: IGameRepository<SushiGoPlayer, SushiGoGame>,
    gameFactory: (code: String, adminId: UUID) -> SushiGoGame,
    playerFactory: (id: UUID, settings: MutableMap<String, Any>) -> SushiGoPlayer
) : Server<SushiGoPlayer, SushiGoGame>(gameRepository, gameFactory, playerFactory), IServer<SushiGoPlayer, SushiGoGame> {
    private fun safeGetGame(gameCode: String): SushiGoGame {
        require(gameCode.isNotEmpty()) { "Code is empty" }
        val game = gameRepository.getByCode(gameCode)

        require(game != null) { "That game does not exist" }
        return game
    }

    fun startRound(gameCode: String, id: UUID) {
        val game = safeGetGame(gameCode)
        require(game.adminId == id) { "You are not the admin of this game" }

        game.startRound()
    }

    fun startPlay(gameCode: String, id: UUID) {
        val game = safeGetGame(gameCode)
        require(game.adminId == id) { "You are not the admin of this game" }

        game.startPlay()
    }

    fun playCards(gameCode: String, user: UUID, request: List<PlayCardRequest>): String {
        val game = safeGetGame(gameCode)
        val player = game.safeGetPlayer(user)

        require(request.size == 1 || request.size == 2) { "Invalid number of cards" }
        require(request.size == 1 || player.cardsPlayed.any { it is Chopsticks }) { "You can only play 2 cards if you have previously played chopsticks" }
        require(request.all { it.wasabi == null || player.cardsPlayed.find { c -> c is Wasabi && c.nigiri == null && c.id == it.wasabi } != null }) { "You don't have enough empty Wasabi for this move" }

        game.playCard(user, request)

        return "Play successfully completed"
    }
}
