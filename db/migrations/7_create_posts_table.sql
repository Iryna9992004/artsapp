CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR (100) NOT NULL,
    post_description VARCHAR (2000) NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT user_id
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
)