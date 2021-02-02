import io.socket.engineio.server.EngineIoServer
import io.socket.engineio.server.EngineIoSocket

fun main() {
    val server = EngineIoServer()
    server.on("connection") { connection ->
        val socket = connection[0] as EngineIoSocket

        socket.on("message") { message ->

        }
    }
}