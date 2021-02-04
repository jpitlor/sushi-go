import com.corundumstudio.socketio.Configuration
import com.corundumstudio.socketio.SocketIOServer
import java.util.*

enum class Event {

}

class Server(private val onMessage: Map<String, (UUID, List<Any>) -> Unit>) {
    private val server: SocketIOServer

    init {
        val config = Configuration()
        config.hostname = System.getProperty("host") ?: "localhost"
        config.port = System.getProperty("port").toIntOrNull() ?: 8080

        server = SocketIOServer(config)
    }

    fun start() {
        server.start()
        server.addEventInterceptor { client, event, args, _ ->
            onMessage[event]?.let { it(client.sessionId, args) }
        }
    }

    fun sendMessage(event: Event, message: Any, game: String, player: Player?) {
        if (player == null) {
            server.getRoomOperations(game).sendEvent(event.name, message)
        } else {
            server.getClient(player.uuid).sendEvent(event.name, message)
        }
    }
}
