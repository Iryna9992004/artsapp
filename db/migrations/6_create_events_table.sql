CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR (100) NOT NULL,
    event_description VARCHAR (1000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    CONSTRAINT user_id
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
)