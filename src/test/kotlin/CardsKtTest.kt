import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.assertEquals

internal class CardsKtTest {
    @Test
    fun scoreSomePoints() {
        val nigiri = Nigiri(3)
        val hand = arrayListOf(Tempura, Tempura, Sashimi, Sashimi, Sashimi, nigiri, Wasabi(nigiri))
        val score = hand.score()

        assertEquals(24, score)
    }

    @Test
    fun scoreNoPoints() {
        val hand = arrayListOf(Chopsticks, Pudding, Wasabi(), Tempura, Sashimi)
        val score = hand.score()

        assertEquals(0, score)
    }

    @Test
    fun scoreIncompleteSets() {
        val hand = arrayListOf(Tempura, Sashimi, Sashimi)
        val score = hand.score()

        assertEquals(0, score)
    }

    @Test
    fun scoreRoundNoPudding() {
        val jim = Player("Jim")
        jim.puddingCount = 2

        val jan = Player("Jan")
        jan.puddingCount = 1

        val sue = Player("Sue")
        sue.puddingCount = 0

        val players = arrayListOf(jim, jan, sue)
        players.scoreRound()

        assertEquals(0, jim.score)
        assertEquals(0, jan.score)
        assertEquals(0, sue.score)
    }

    @Test
    fun scoreRoundWithPudding() {
        val jim = Player("Jim")
        jim.puddingCount = 2

        val jan = Player("Jan")
        jan.puddingCount = 1

        val sue = Player("Sue")
        sue.puddingCount = 0

        val players = arrayListOf(jim, jan, sue)
        players.scoreRound(isEndOfGame = true)

        assertEquals(6, jim.score)
        assertEquals(0, jan.score)
        assertEquals(-6, sue.score)
    }

    @Test
    fun scoreRoundFirstPlaceMakiTie() {
        val jim = Player("Jim")
        jim.cardsPlayed += Maki(3)

        val jan = Player("Jan")
        jan.cardsPlayed += Maki(3)

        val sue = Player("Sue")
        sue.cardsPlayed += Maki(1)

        val players = arrayListOf(jim, jan, sue)
        players.scoreRound()

        assertEquals(3, jim.score)
        assertEquals(3, jan.score)
        assertEquals(0, sue.score)
    }
}