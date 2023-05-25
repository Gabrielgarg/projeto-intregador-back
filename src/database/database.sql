-- Active: 1682511537450@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO users (id, name, email, password, role)
VALUES
  -- tipo NORMAL e senha = fulano123
	('u001', 'Fulano', 'fulano@email.com', '$2a$12$qPQj5Lm1dQK2auALLTC0dOWedtr/Th.aSFf3.pdK5jCmYelFrYadC', 'NORMAL'),

  -- tipo NORMAL e senha = beltrana00
	('u002', 'Beltrana', 'beltrana@email.com', '$2a$12$403HVkfVSUbDioyciv9IC.oBlgMqudbnQL8ubebJIXScNs8E3jYe2', 'NORMAL'),

  -- tipo ADMIN e senha = astrodev99
	('u003', 'Astrodev', 'astrodev@email.com', '$2a$12$lHyD.hKs3JDGu2nIbBrxYujrnfIX5RW5oq/B41HCKf7TSaq9RgqJ.', 'ADMIN'),
    ('u004', 'Gabrieldev', 'gabriel123@email.com', 'Senhadoida123@', 'ADMIN');


DROP TABLE users;
DROP TABLE posts;

DROP TABLE likes_dislikes;

CREATE TABLE posts (
    id text unique not null,
    creator_id text not null,
    content text not null,
    likes REAL not null,
    dislikes REAL not null,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    update_at TEXT DEFAULT (DATETIME()) NOT NULL,
    foreign key (creator_id) references users(id)
);

INSERT INTO posts (id, creator_id, content, likes, dislikes)
VALUES

	('66ab0a73-7f81-4326-aefd-227139216dd2', 'u004', 'asdasdas', 0, 0);

CREATE TABLE likes_dislikes(
    user_id text not null,
    post_id text not null,
    like INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);


CREATE TABLE comment (
    id text unique not null,
    creator_id text not null,
    post_id TEXT NOT NULL,
    content text not null,
    likes REAL not null,
    dislikes REAL not null,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    update_at TEXT DEFAULT (DATETIME()) NOT NULL,
    foreign key (creator_id) references users(id),
    foreign key (post_id) references posts(id)

);

CREATE TABLE likes_dislikes_comment(
    user_id text not null,
    comment_id text not null,
    like INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (comment_id) REFERENCES comment (id)
);

SELECT * from likes_dislikes_comment;
drop TABLE comment;


SELECT * FROM users;
SELECT * FROM comments_post;
SELECT * FROM likes_dislikes;