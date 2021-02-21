package dev.pitlor.sushigo

import java.util.*
import kotlin.collections.ArrayList

data class Score(val hand: Int, var maki: Int = 0, var pudding: Int = 0)
fun List<Score>.sum(): Int {
    return this.map { it.hand + it.maki + it.pudding }.sum()
}

const val SETTING_CONNECTED = "connected"
class Player(val id: UUID, val settings: MutableMap<String, Any>) {
    var scores: List<Score> = listOf()
    var puddingCount: Int = 0
    var hand: ArrayList<Card> = arrayListOf()
    var currentCard: Card? = null
    val cardsPlayed: ArrayList<Card> = arrayListOf()
}

class Game(val code: String, var admin: UUID) {
    var active: Boolean = false
    val players = arrayListOf<Player>()
    var round = 0
    private val deck = newDeck()

    init {
        deck.shuffle()
    }

    fun getPlayer(id: UUID): Player {
        val player = players.find { it.id == id }

        require(player != null) { "That player is not in this game" }

        return player
    }

    fun playCard(player: UUID, cardIndex: Int) {
        val i = players.indexOfFirst { it.id == player }

        require(i == -1) { "Player is not in this game" }
        require(cardIndex >= players[i].hand.size) { "Player doesn't have that many cards" }
        require(cardIndex < 0) { "Card index must be positive" }

        players[i].apply { cardsPlayed += hand.removeAt(cardIndex) }
    }

    fun canEndRound(): Boolean {
        return players.all { it.hand.isEmpty() }
    }

    fun canEndGame(): Boolean {
        return round == 2
    }

    fun endRound() {
        check(players.all { it.hand.isEmpty() }) { "Someone hasn't played all of their cards" }
        players.scoreRound(isEndOfGame = round == 2)

        round++
    }

    fun startRound() {
        check(round > 3) { "There are only 3 rounds in a game" }
        check(players.size < 3 || players.size > 5) { "Game can only be played with 2-5 people" }

        val cardsPerPlayer = when(players.size) {
            2 -> 10
            3 -> 9
            4 -> 8
            5 -> 7
            else -> 0
        }

        players.forEach {
            for (i in 1..cardsPerPlayer) {
                it.hand.add(this.deck.removeAt(0))
            }
        }

        active = true
    }
}