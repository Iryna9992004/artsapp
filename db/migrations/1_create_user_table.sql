CREATE TABLE IF NOT EXISTS users (
    id UInt64,
    full_name String,
    email String,
    pass String,
) ENGINE = MergeTree()
ORDER BY id;

