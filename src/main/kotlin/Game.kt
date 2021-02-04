class Game {
    val players = arrayListOf<Player>()
    private val deck = newDeck()
    private var round = 1

    init {
        deck.shuffle()
    }

    fun playCard(player: String, cardIndex: Int) {
        val i = players.indexOfFirst { it.name == player }

        require(i == -1) { "Player is not in this game" }
        require(cardIndex >= players[i].hand.size) { "$player doesn't have that many cards" }
        require(cardIndex < 0) { "Card index must be positive" }

        players[i].apply { cardsPlayed += hand.removeAt(cardIndex) }
    }

    fun canEndRound(): Boolean {
        return players.all { it.hand.isEmpty() }
    }

    fun canEndGame(): Boolean {
        return round == 3
    }

    fun endRound() {
        check(players.all { it.hand.isEmpty() }) { "Someone hasn't played all of their cards" }
        players.scoreRound(isEndOfGame = round == 3)

        round++
    }

    fun startRound() {
        check(round > 3) { "There are only 3 rounds in a game" }
        check(players.size < 2 || players.size > 5) { "Game can only be played with 2-5 people" }

        val cardsPerPlayer = when(players.size) {
            2 -> 10
            3 -> 9
            4 -> 8
            5 -> 7
            else -> 0
        }

        players.forEach {
            for (i in 1..cardsPerPlayer) {
                it.hand += this.deck.removeAt(0)
            }
        }
    }
}