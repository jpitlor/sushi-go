import java.lang.Exception

class Game {
    val players = arrayListOf<Player>()
    private var deck = newDeck()
    var round = 1
        private set

    init {
        deck.shuffle()
    }

    fun scoreRound() {
        players.scoreRound(isEndOfGame = round == 3)
    }

    fun startRound() {
        if (round > 3) {
            throw Exception("There are only 3 rounds in a game")
        }

        if (players.size < 2 || players.size > 5) {
            throw Exception("Game can only be played with 2-5 people")
        }

        val cardsPerPlayer = when(players.size) {
            2 -> 10
            3 -> 9
            4 -> 8
            5 -> 7
            else -> 0
        }

        players.forEach {
            it.hand += this.deck.take(cardsPerPlayer)
            this.deck = this.deck.drop(cardsPerPlayer).toTypedArray()
        }

        round++
    }
}