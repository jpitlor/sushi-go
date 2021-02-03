class Player(val name: String) {
    var score: Int = 0
    var puddingCount: Int = 0
    val hand: ArrayList<Card> = arrayListOf()
    val cardsPlayed: ArrayList<Card> = arrayListOf()
}
