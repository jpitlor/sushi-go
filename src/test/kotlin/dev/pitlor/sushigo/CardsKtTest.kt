package dev.pitlor.sushigo

import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.assertEquals
import java.util.*

internal class CardsKtTest {
    private val settings = mutableMapOf<String, Any>()
    @Test
    fun scoreSomePoints() {
        val nigiri = Nigiri(3)
        val hand = arrayListOf(Tempura(), Tempura(), Sashimi(), Sashimi(), Sashimi(), nigiri, Wasabi(nigiri))
        val score = hand.score()

        assertEquals(24, score)
    }

    @Test
    fun scoreNoPoints() {
        val hand = arrayListOf(Chopsticks(), Pudding(), Wasabi(), Tempura(), Sashimi())
        val score = hand.score()

        assertEquals(0, score)
    }

    @Test
    fun scoreIncompleteSets() {
        val hand = arrayListOf(Tempura(), Sashimi(), Sashimi())
        val score = hand.score()

        assertEquals(0, score)
    }

    @Test
    fun scoreRoundNoPudding() {
        val jim = SushiGoPlayer(UUID.randomUUID(), settings)
        jim.puddingCount = 2

        val jan = SushiGoPlayer(UUID.randomUUID(), settings)
        jan.puddingCount = 1

        val sue = SushiGoPlayer(UUID.randomUUID(), settings)
        sue.puddingCount = 0

        val players = arrayListOf(jim, jan, sue)
        players.scoreRound()

        assertEquals(0, jim.scores.sum())
        assertEquals(0, jan.scores.sum())
        assertEquals(0, sue.scores.sum())
    }

    @Test
    fun scoreRoundWithPudding() {
        val jim = SushiGoPlayer(UUID.randomUUID(), settings)
        jim.puddingCount = 2

        val jan = SushiGoPlayer(UUID.randomUUID(), settings)
        jan.puddingCount = 1

        val sue = SushiGoPlayer(UUID.randomUUID(), settings)
        sue.puddingCount = 0

        val players = arrayListOf(jim, jan, sue)
        players.scoreRound(isEndOfGame = true)

        assertEquals(6, jim.scores.sum())
        assertEquals(0, jan.scores.sum())
        assertEquals(-6, sue.scores.sum())
    }

    @Test
    fun scoreRoundFirstPlaceMakiTie() {
        val jim = SushiGoPlayer(UUID.randomUUID(), settings)
        jim.cardsPlayed += Maki(3)

        val jan = SushiGoPlayer(UUID.randomUUID(), settings)
        jan.cardsPlayed += Maki(3)

        val sue = SushiGoPlayer(UUID.randomUUID(), settings)
        sue.cardsPlayed += Maki(1)

        val players = arrayListOf(jim, jan, sue)
        players.scoreRound()

        assertEquals(3, jim.scores.sum())
        assertEquals(3, jan.scores.sum())
        assertEquals(0, sue.scores.sum())
    }
}