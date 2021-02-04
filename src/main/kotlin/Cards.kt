sealed class Card

object Tempura : Card()
object Sashimi : Card()
object Dumpling : Card()
data class Maki(val count: Int) : Card()
data class Nigiri(val value: Int) : Card()
object Pudding : Card()
data class Wasabi(var nigiri: Nigiri? = null) : Card()
object Chopsticks : Card()

fun newDeck(): ArrayList<Card> {
    return arrayListOf(
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
        *Array(6) { Wasabi() },
        *Array(4) { Chopsticks }
    )
}

fun ArrayList<Player>.scoreRound(isEndOfGame: Boolean = false) {
    // Sum the cards not dependent on other players
    this.forEach { it.score += it.cardsPlayed.score() }

    // Add points for Maki
    val makiGroups = this.groupBy { it.cardsPlayed.filterIsInstance<Maki>().map { m -> m.count }.sum() }
    val keys = makiGroups.keys.sortedDescending()
    val makiFirst = keys.getOrElse(0) { 0 }
    val makiSecond = keys.getOrElse(1) { 0 }

    if (makiFirst > 0) {
        makiGroups[makiFirst]!!.forEach { it.score += 6 / makiGroups[makiFirst]!!.size }
    }
    if (makiGroups[makiFirst]!!.size == 1 && makiSecond > 0) {
        makiGroups[makiSecond]!!.forEach { it.score += 3 / makiGroups[makiSecond]!!.size }
    }

    // Add points for Pudding
    if (isEndOfGame) {
        val puddingGroups = this.groupBy { it.puddingCount + it.cardsPlayed.filterIsInstance<Pudding>().size }
        val puddingFirst = puddingGroups.keys.maxOrNull()
        val puddingLast = puddingGroups.keys.minOrNull()

        if (puddingFirst!! > 0) {
            puddingGroups[puddingFirst]!!.forEach { it.score += 6 / puddingGroups[puddingFirst]!!.size }
        }
        if (this.size > 2 && puddingFirst != puddingLast) {
            puddingGroups[puddingLast]!!.forEach { it.score -= 6 / puddingGroups[puddingLast]!!.size }
        }
    } else {
        this.forEach { it.puddingCount += it.cardsPlayed.filterIsInstance<Pudding>().size }
    }
}

fun ArrayList<Card>.score(): Int {
    var score = 0
    score += this.filterIsInstance<Nigiri>().map { it.value }.sum()
    score += this.filterIsInstance<Wasabi>().map { (it.nigiri?.value ?: 0) * 2 }.sum()
    score += this.filterIsInstance<Tempura>().size / 2 * 5
    score += this.filterIsInstance<Sashimi>().size / 3 * 10
    score += when (this.filterIsInstance<Dumpling>().size) {
        0 -> 0
        1 -> 1
        2 -> 3
        3 -> 6
        4 -> 10
        else -> 15
    }
    return score
}