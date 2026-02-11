-- Create Database
CREATE DATABASE IF NOT EXISTS pilih_jagoan_mu DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pilih_jagoan_mu;

-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  phone VARCHAR(20) DEFAULT '',
  address TEXT,
  profilePhoto VARCHAR(500),
  role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
  isActive TINYINT(1) DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Elections Table
CREATE TABLE elections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'other',
  startDate DATETIME NOT NULL,
  endDate DATETIME NOT NULL,
  isPublic TINYINT(1) DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending',
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Candidates Table
CREATE TABLE candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  photo VARCHAR(500),
  position VARCHAR(255) NOT NULL,
  vissionMission TEXT,
  experience TEXT,
  achievement LONGTEXT,
  electionId INT NOT NULL,
  voteCount INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  createdBy INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Votes Table
CREATE TABLE votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  electionId INT NOT NULL,
  candidateId INT NOT NULL,
  votedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
  FOREIGN KEY (candidateId) REFERENCES candidates(id) ON DELETE CASCADE,
  UNIQUE KEY unique_vote (userId, electionId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  type VARCHAR(50) DEFAULT 'system',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  relatedId INT,
  relatedModel VARCHAR(50),
  isRead TINYINT(1) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Indexes
CREATE INDEX idx_elections_createdBy ON elections(createdBy);
CREATE INDEX idx_elections_status ON elections(status);
CREATE INDEX idx_candidates_electionId ON candidates(electionId);
CREATE INDEX idx_candidates_createdBy ON candidates(createdBy);
CREATE INDEX idx_votes_userId ON votes(userId);
CREATE INDEX idx_votes_electionId ON votes(electionId);
CREATE INDEX idx_votes_candidateId ON votes(candidateId);
CREATE INDEX idx_notifications_userId ON notifications(userId);
CREATE INDEX idx_notifications_isRead ON notifications(isRead);
