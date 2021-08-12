package dev.pitlor.sushigo

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.*

internal class SushiGoGameTest {
    private val settings = mutableMapOf<String, Any>()

    @Test
    fun getPlayers() {
        val game = SushiGoGame("", UUID.randomUUID())
        game.players += Player(UUID.randomUUID(), settings)
        game.players += Player(UUID.randomUUID(), settings)
        game.players += Player(UUID.randomUUID(), settings)

        assertEquals(3, game.players.size)
    }

    @Test
    fun startRoundMoreThan3Times() {
        val game = SushiGoGame("", UUID.randomUUID())
        game.players += Player(UUID.randomUUID(), settings)
        game.players += Player(UUID.randomUUID(), settings)
        game.players += Player(UUID.randomUUID(), settings)

        game.startRound()
        game.startRound()
        game.startRound()
        val exception = assertThrows(Exception::class.java) {
            game.startRound()
        }
        assertEquals("There are only 3 rounds in a game", exception.message)
    }

    @Test
    fun startRoundWithInvalidPlayerCount() {
        val game = SushiGoGame("", UUID.randomUUID())
        game.players += Player(UUID.randomUUID(), settings)

        val exception = assertThrows(Exception::class.java) {
            game.startRound()
        }
        assertEquals("Game can only be played with 3-5 people", exception.message)
    }

    @Test
    fun playCardPlayerDoesntExist() {

    }

    @Test
    fun playCardInvalidIndex() {

    }

    @Test
    fun playCard() {

    }
}