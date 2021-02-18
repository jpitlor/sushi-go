package dev.pitlor.sushigo

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.*

internal class GameTest {
    private val settings = PlayerSettings("Jim", "")

    @Test
    fun getPlayers() {
        val game = Game("", UUID.randomUUID())
        game.players += Player(UUID.randomUUID(), settings)
        game.players += Player(UUID.randomUUID(), settings)
        game.players += Player(UUID.randomUUID(), settings)

        assertEquals(3, game.players.size)
    }

    @Test
    fun startRoundMoreThan3Times() {
        val game = Game("", UUID.randomUUID())
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
        val game = Game("", UUID.randomUUID())
        game.players += Player(UUID.randomUUID(), settings)

        val exception = assertThrows(Exception::class.java) {
            game.startRound()
        }
        assertEquals("Game can only be played with 2-5 people", exception.message)
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