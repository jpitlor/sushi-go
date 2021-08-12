package dev.pitlor.sushigo

import dev.pitlor.gamekit_spring_boot_starter.Game
import java.time.LocalDateTime
import java.util.*

data class Score(val hand: Int, var maki: Int = 0, var pudding: Int = 0)

fun List<Score>.sum(): Int {
    return this.sumOf { it.hand + it.maki + it.pudding }
}

class Player(val id: UUID, val settings: MutableMap<String, Any>) {
    var scores: List<Score> = listOf()
    var puddingCount: Int = 0
    var hand: ArrayList<Card> = arrayListOf()
    var currentCard: ArrayList<PlayCardRequest> = arrayListOf()
    val cardsPlayed: ArrayList<Card> = arrayListOf()
    var startOfTimeOffline: LocalDateTime? = null

    // This is a property passed down to the client to enable/disable drag+drop
    @Suppress("unused")
    val canDrag: Boolean get() = currentCard.size == 0 || (currentCard.size == 1 && cardsPlayed.contains(Chopsticks()))
}

class SushiGoGame(val code: String, var admin: UUID) : Game {
    val players = arrayListOf<Player>()
    var active: Boolean = false
    var round = 0

    // These 2 are properties passed down to the client to disable/enable admin buttons
    @Suppress("unused")
    val canStartPlay: Boolean get() = players.all { it.currentCard.size > 0 }
    @Suppress("unused")
    val canStartRound: Boolean get() = players.all { it.hand.isEmpty() }

    private val deck = newDeck().shuffled().toMutableList()

    fun playCard(player: UUID, cardRequest: List<PlayCardRequest>) {
        val user = players.find { it.id == player }
        require(user != null) { "Player is not in this game" }

        user.currentCard.addAll(cardRequest)
    }

    fun startPlay() {
        players.forEach { player ->
            player.currentCard.forEach { request ->
                if (request.wasabi != null) {
                    require(request.card is Nigiri) { "You can only play a Nigiri on a Wasabi" }
                    player.cardsPlayed
                        .filterIsInstance<Wasabi>()
                        .first { c -> c.id == request.wasabi }
                        .nigiri = request.card
                } else {
                    player.cardsPlayed += request.card
                }

                val cardFound = player.hand.remove(request.card)
                check(cardFound) { "The card played was not found in the hand" }
            }

            if (player.currentCard.size == 2) {
                val chopsticksIndex = player.cardsPlayed.indexOfFirst { it is Chopsticks }
                val chopsticks = player.cardsPlayed.removeAt(chopsticksIndex)
                player.hand.add(chopsticks)
            }

            player.currentCard.clear()
        }

        val swp = players.first().hand
        players.forEachIndexed { index, player ->
            if (index != players.size - 1) {
                player.hand = players[index + 1].hand
            } else {
                player.hand = swp
            }
        }

        if (players.all { it.hand.size == 0 }) {
            players.scoreRound(isEndOfGame = round == 2)
        }
    }

    fun startRound() {
        check(round < 3) { "There are only 3 rounds in a game" }
        check(players.size in 3..5) { "Game can only be played with 3-5 people" }

        val cardsPerPlayer = when (players.size) {
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

            it.cardsPlayed.clear()
        }

        active = true
        round++
    }
}