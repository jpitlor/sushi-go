package dev.pitlor.sushigo

val games = arrayListOf<Game>()

class Server {
    fun getGames(): Iterable<String> {
        return games.map { it.code }
    }

    fun createGame(code: String): String {
        require(code.isNotEmpty()) { "Code is empty" }
        require(games.firstOrNull { it.code == code } == null) { "That game code is already in use" }

        games += Game(code)

        return "Game \"${code}\" Created"
    }

    fun joinGame(code: String, user: String) {

    }
}

