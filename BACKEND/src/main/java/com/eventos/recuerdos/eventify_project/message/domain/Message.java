package com.eventos.recuerdos.eventify_project.message.domain;

import com.eventos.recuerdos.eventify_project.chat.domain.Chat;
import com.eventos.recuerdos.eventify_project.memory.domain.Memory;
import com.eventos.recuerdos.eventify_project.user.domain.UserAccount;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // Relación Many-to-One con el Usuario
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)  // Cambiado para coincidir con 'author'
    @OnDelete(action = OnDeleteAction.CASCADE)
    private UserAccount messageOwner;  // Usuario que hizo la publicación


    // Relación Many-to-One con Chat
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;  // Recuerdo al que pertenece la publicación

}
