CREATE TABLE IF NOT EXISTS prexel_posts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL ,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    image_path TEXT,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prexel_user
        FOREIGN KEY(user_id)
        REFERENCES prexel_users(id)
        ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_prexel_posts_user_id ON prexel_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_prexel_posts_create_date ON prexel_posts(create_date);