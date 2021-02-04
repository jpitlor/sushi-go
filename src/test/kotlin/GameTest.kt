import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

internal class GameTest {
    @Test
    fun getPlayers() {
        val game = Game()
        game.players += Player("Jim")
        game.players += Player("John")
        game.players += Player("Jan")

        assertEquals(3, game.players.size)
    }

    @Test
    fun startRoundMoreThan3Times() {
        val game = Game()
        game.players += Player("Jim")
        game.players += Player("John")

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
        val game = Game()
        game.players += Player("Jim")

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