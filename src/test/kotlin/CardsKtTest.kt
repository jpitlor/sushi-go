import org.junit.jupiter.api.*

internal class CardsKtTest {
    @Test
    fun scoreSomePoints() {
        val nigiri = Nigiri(3)
        val hand = arrayListOf(Tempura, Tempura, Sashimi, Sashimi, Sashimi, nigiri, Wasabi(nigiri))
        val score = hand.score()

        assert(score == 24)
    }

    @Test
    fun scoreNoPoints() {
        val hand = arrayListOf(Chopsticks, Pudding, Wasabi(), Tempura, Sashimi)
        val score = hand.score()

        assert(score == 0)
    }

    @Test
    fun scoreIncompleteSets() {
        val hand = arrayListOf(Tempura, Sashimi, Sashimi)
        val score = hand.score()

        assert(score == 0)
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

        assert(jim.score == 0)
        assert(jan.score == 0)
        assert(sue.score == 0)
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

        assert(jim.score == 6)
        assert(jan.score == 0)
        assert(sue.score == -6)
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

        assert(jim.score == 3)
        assert(jan.score == 3)
        assert(sue.score == 0)
    }
}