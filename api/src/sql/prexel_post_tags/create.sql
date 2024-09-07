CREATE TABLE IF NOT EXISTS prexel_post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    CONSTRAINT fk_prexel_posts
        FOREIGN KEY(post_id)
        REFERENCES prexel_posts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_prexel_tags
        FOREIGN KEY(tag_id)
        REFERENCES prexel_tags(id)
        ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_prexel_post_tags_post_id ON prexel_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_prexel_post_tags_tag_id ON prexel_post_tags(tag_id);
