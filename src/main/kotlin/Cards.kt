sealed class Card

object Tempura : Card()
object Sashimi : Card()
object Dumpling : Card()
data class Maki(val count: Int) : Card()
data class Nigiri(val value: Int, var wasabi: Wasabi? = null) : Card()
object Pudding : Card()
object Wasabi : Card()
object Chopsticks : Card()

fun newDeck(): Array<Card> {
    return arrayOf(
        *Array(14) { Tempura },
        *Array(14) { Sashimi },
        *Array(14) { Dumpling },
        *Array(12) { Maki(2) },
        *Array(8) { Maki(3) },
        *Array(6) { Maki(1) },
        *Array(10) { Nigiri(2) },
        *Array(5) { Nigiri(3) },
        *Array(5) { Nigiri(1) },
        *Array(10) { Pudding },
        *Array(6) { Wasabi },
        *Array(4) { Chopsticks }
    )
}

fun Array<Card>.score() {

}