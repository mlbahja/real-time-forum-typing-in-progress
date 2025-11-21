PRAGMA foreign_keys = ON;

CREATE TABLE
    IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        age INTEGER CHECK (age BETWEEN 14 AND 80),
        email TEXT NOT NULL UNIQUE,
        gender TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT current_timestamp NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS posts (
        post_id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        category_name TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT current_timestamp NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (user_id)
    );

CREATE TABLE
    IF NOT EXISTS categories (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT NOT NULL UNIQUE
    );

CREATE TABLE
    IF NOT EXISTS comments (
        comment_id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        post_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT current_timestamp NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS Reactions (
        user_id INTEGER NOT NULL,
        post_id TEXT,
        comment_id TEXT,
        reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
        created_at TEXT DEFAULT current_timestamp NOT NULL,
        PRIMARY KEY (user_id, post_id,  comment_id),
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments (comment_id)
    );

CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT current_timestamp NOT NULL,
    expired_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chats (
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT current_timestamp NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id)
);

INSERT OR IGNORE INTO categories (category_name) VALUES
    ('Technology'),
    ('Sport'),
    ('Health'),
    ('Lifestyle'),
    ('Education');