package dev.pitlor.sushigo

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.*

internal class GameTest {
    @Test
    fun getPlayers() {
        val game = Game("")
        game.players += Player("Jim", UUID.randomUUID())
        game.players += Player("John", UUID.randomUUID())
        game.players += Player("Jan", UUID.randomUUID())

        assertEquals(3, game.players.size)
    }

    @Test
    fun startRoundMoreThan3Times() {
        val game = Game("")
        game.players += Player("Jim", UUID.randomUUID())
        game.players += Player("John", UUID.randomUUID())

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
        val game = Game("")
        game.players += Player("Jim", UUID.randomUUID())

        val exception = assertThrows(Exception::class.java) {
            game.startRound()
        }
        assertEquals("dev.pitlor.sushigo.Game can only be played with 2-5 people", exception.message)
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