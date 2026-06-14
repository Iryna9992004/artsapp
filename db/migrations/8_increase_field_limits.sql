-- Збільшення лімітів полів: title до 200 символів, опис/текст до 2000.
ALTER TABLE events ALTER COLUMN title TYPE VARCHAR(200);
ALTER TABLE events ALTER COLUMN event_description TYPE VARCHAR(2000);

ALTER TABLE posts ALTER COLUMN title TYPE VARCHAR(200);
ALTER TABLE posts ALTER COLUMN post_description TYPE VARCHAR(2000);

ALTER TABLE topics ALTER COLUMN text TYPE VARCHAR(2000);
