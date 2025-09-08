CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT generateUUIDv4(),
    full_name String,
    email String,
    pass String,
) ENGINE = MergeTree()
ORDER BY id;

