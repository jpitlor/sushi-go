package dev.pitlor.sushigo

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.*

@Configuration
open class Factories {
    @Bean
    open fun gameFactory(): (code: String, adminId: UUID) -> SushiGoGame {
        return ::SushiGoGame
    }

    @Bean
    open fun playerFactory(): (id: UUID, settings: MutableMap<String, Any>) -> SushiGoPlayer {
        return ::SushiGoPlayer
    }
}