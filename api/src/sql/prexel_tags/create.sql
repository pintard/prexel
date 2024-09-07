CREATE TABLE IF NOT EXISTS prexel_tags (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_prexel_tags_name ON prexel_tags(name);
