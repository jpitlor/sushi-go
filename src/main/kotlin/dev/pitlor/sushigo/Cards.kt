package dev.pitlor.sushigo

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import java.util.*
import kotlin.collections.ArrayList

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(Tempura::class, name = "tempura"),
    JsonSubTypes.Type(Sashimi::class, name = "sashimi"),
    JsonSubTypes.Type(Dumpling::class, name = "dumpling"),
    JsonSubTypes.Type(Maki::class, name = "maki"),
    JsonSubTypes.Type(Nigiri::class, name = "nigiri"),
    JsonSubTypes.Type(Pudding::class, name = "pudding"),
    JsonSubTypes.Type(Wasabi::class, name = "wasabi"),
    JsonSubTypes.Type(Chopsticks::class, name = "chopsticks")
)
sealed class Card(val type: String)

data class Tempura(val id: UUID = UUID.randomUUID()) : Card("tempura")
data class Sashimi(val id: UUID = UUID.randomUUID()) : Card("sashimi")
data class Dumpling(val id: UUID = UUID.randomUUID()) : Card("dumpling")
data class Maki(val count: Int, val id: UUID = UUID.randomUUID()) : Card("maki")
data class Nigiri(val value: Int, val id: UUID = UUID.randomUUID()) : Card("nigiri")
data class Pudding(val id: UUID = UUID.randomUUID()) : Card("pudding")
data class Wasabi(var nigiri: Nigiri? = null, val id: UUID = UUID.randomUUID()) : Card("wasabi")
data class Chopsticks(val id: UUID = UUID.randomUUID()) : Card("chopsticks")

fun newDeck(): ArrayList<Card> {
    return arrayListOf(
        *Array(14) { Tempura() },
        *Array(14) { Sashimi() },
        *Array(14) { Dumpling() },
        *Array(12) { Maki(2) },
        *Array(8) { Maki(3) },
        *Array(6) { Maki(1) },
        *Array(10) { Nigiri(2) },
        *Array(5) { Nigiri(3) },
        *Array(5) { Nigiri(1) },
        *Array(10) { Pudding() },
        *Array(6) { Wasabi() },
        *Array(4) { Chopsticks() }
    )
}

fun ArrayList<Player>.scoreRound(isEndOfGame: Boolean = false) {
    // Sum the cards not dependent on other players
    this.forEach { it.scores += Score(it.cardsPlayed.score()) }

    // Add points for Maki
    val makiGroups = this.groupBy { it.cardsPlayed.filterIsInstance<Maki>().map { m -> m.count }.sum() }
    val keys = makiGroups.keys.sortedDescending()
    val makiFirst = keys.getOrElse(0) { 0 }
    val makiSecond = keys.getOrElse(1) { 0 }

    if (makiFirst > 0) {
        makiGroups[makiFirst]!!.forEach {
            it.scores.last().maki = 6 / makiGroups[makiFirst]!!.size
        }
    }
    if (makiGroups[makiFirst]!!.size == 1 && makiSecond > 0) {
        makiGroups[makiSecond]!!.forEach {
            it.scores.last().maki = 3 / makiGroups[makiSecond]!!.size
        }
    }

    // Add points for Pudding
    if (isEndOfGame) {
        val puddingGroups = this.groupBy { it.puddingCount + it.cardsPlayed.filterIsInstance<Pudding>().size }
        val puddingFirst = puddingGroups.keys.maxOrNull()
        val puddingLast = puddingGroups.keys.minOrNull()

        if (puddingFirst != null) {
            puddingGroups[puddingFirst]!!.forEach {
                it.scores.last().pudding = 6 / puddingGroups[puddingFirst]!!.size
            }
        }
        if (this.size > 2 && puddingLast != null) {
            puddingGroups[puddingLast]!!.forEach {
                it.scores.last().pudding = -6 / puddingGroups[puddingLast]!!.size
            }
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