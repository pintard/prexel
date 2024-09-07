CREATE TABLE prexel_users (
    id SERIAL PRIMARY KEY,
    email_address VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    image_path TEXT,
    bio TEXT,
    contact_display_name VARCHAR(255),
    contact_url VARCHAR(255),
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_prexel_users_id ON prexel_users(id);
CREATE INDEX IF NOT EXISTS idx_prexel_users_create_date ON prexel_users(create_date);