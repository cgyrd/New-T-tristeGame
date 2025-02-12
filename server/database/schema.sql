CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE game (
  id_game INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES user(id) 
);

/* insertion d'un nouveau user, et nouveau score */ 
INSERT INTO user (name) VALUES ('Pseudo');
INSERT INTO game (user_id, score) VALUES (LAST_INSERT_ID(), 100);

