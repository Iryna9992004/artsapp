CREATE TABLE message_reads(
    id SERIAL PRIMARY KEY,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    message_id INT NOT NULL,
    CONSTRAINT user_id
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT message_id
        FOREIGN KEY (message_id)
        REFERENCES messages (id)
        ON DELETE CASCADE
)