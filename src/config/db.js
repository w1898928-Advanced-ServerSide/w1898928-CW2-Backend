const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.resolve(__dirname, "../../database.db"), (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to the database.");
  }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email       TEXT    UNIQUE NOT NULL,
      password    TEXT    NOT NULL,
      createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

    db.run(`CREATE TABLE IF NOT EXISTS blogPosts (
      blogPostId  INTEGER PRIMARY KEY AUTOINCREMENT,
      userId      INTEGER NOT NULL,
      title       TEXT    NOT NULL,
      content     TEXT    NOT NULL,
      country     TEXT    NOT NULL,
      dateOfVisit TEXT    NOT NULL,
      coverImage TEXT,
      createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(userId)
      )`);

   db.run(`CREATE TABLE IF NOT EXISTS follows (
      followId     INTEGER PRIMARY KEY AUTOINCREMENT,
      followerId   INTEGER NOT NULL,
      followingId  INTEGER NOT NULL,
      createdAt    DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (followerId)  REFERENCES users(userId),
      FOREIGN KEY (followingId) REFERENCES users(userId)
      )`);

  db.run(`CREATE TABLE IF NOT EXISTS reactions (
      reactionId  INTEGER PRIMARY KEY AUTOINCREMENT,
      userId      INTEGER NOT NULL,
      postId      INTEGER NOT NULL,
      type        TEXT    CHECK(type IN ('like','dislike')) NOT NULL,
      createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(userId),
      FOREIGN KEY (postId) REFERENCES blogPosts(blogPostId)
      )`);
      
      console.log("All tables are initialized.");
});

module.exports = db;