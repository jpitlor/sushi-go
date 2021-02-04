import java.util.*
import kotlin.collections.ArrayList

class Player(val name: String, val uuid: UUID) {
    var score: Int = 0
    var puddingCount: Int = 0
    val hand: ArrayList<Card> = arrayListOf()
    val cardsPlayed: ArrayList<Card> = arrayListOf()
}
