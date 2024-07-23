CREATE DATABASE `SKETCHDB` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

CREATE TABLE `USER` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modified` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_created` varchar(45) DEFAULT NULL,
  `user_modified` varchar(45) DEFAULT NULL,
  `status` enum('active','pending','inactive') DEFAULT 'pending',
  `role` enum('user','admin','data_admin') DEFAULT 'user',
  PRIMARY KEY (`id`,`username`),
  UNIQUE KEY `Username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `SKETCH` (
  `sketch_id` int NOT NULL AUTO_INCREMENT,
  `sketcher_id` int NOT NULL,
  `category_id` int NOT NULL,
  `sketch_image` blob NOT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_created` varchar(45) DEFAULT NULL,
  `user_modified` varchar(45) DEFAULT NULL,
  `sketch_strokes` blob NOT NULL,
  PRIMARY KEY (`sketch_id`),
  KEY `id_idx` (`category_id`,`sketcher_id`),
  KEY `sketcher_id_idx` (`sketcher_id`),
  CONSTRAINT `cat_id` FOREIGN KEY (`category_id`) REFERENCES `CATEGORY` (`category_id`),
  CONSTRAINT `sketcher_id` FOREIGN KEY (`sketcher_id`) REFERENCES `USER` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `CATEGORY` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) NOT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_created` varchar(45) DEFAULT NULL,
  `user_modified` varchar(45) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'inactive',
  `description` varchar(250) NOT NULL,
  `category_label` varchar(45) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `Category_Name_UNIQUE` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `BASELINE_GROUP` (
  `baseline_group_id` int NOT NULL AUTO_INCREMENT,
  `group_name` varchar(45) NOT NULL,
  `category_id` int NOT NULL,
  `description` varchar(250) NOT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_created` varchar(45) DEFAULT NULL,
  `user_modified` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`baseline_group_id`),
  KEY `category_id_idx` (`category_id`),
  CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `CATEGORY` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `BASELINE_SKETCH` (
  `baseline_id` int NOT NULL AUTO_INCREMENT,
  `baseline_group_id` int NOT NULL,
  `baseline_name` varchar(200) NOT NULL,
  `baseline_sketch` blob NOT NULL,
  `baseline_ext` varchar(10) NOT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_created` varchar(45) DEFAULT NULL,
  `user_modified` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`baseline_id`),
  KEY `baseline_group_id_idx` (`baseline_group_id`),
  CONSTRAINT `baseline_group_id` FOREIGN KEY (`baseline_group_id`) REFERENCES `BASELINE_GROUP` (`baseline_group_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `PIPELINE_CONFIGURATION` (
  `configuration_id` int NOT NULL AUTO_INCREMENT,
  `baseline_group_id` int NOT NULL,
  `configuration_name` varchar(100) NOT NULL,
  `threshold` float(3,2) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'inactive',
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_created` varchar(45) DEFAULT NULL,
  `user_modified` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`configuration_id`),
  KEY `baseline_group_id_fk_idx` (`baseline_group_id`),
  CONSTRAINT `baseline_group_id_fk` FOREIGN KEY (`baseline_group_id`) REFERENCES `BASELINE_GROUP` (`baseline_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `PIPELINE_RESULTS` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `configuration_id` int NOT NULL,
  `sketch_id` int NOT NULL,
  `result` enum('positive','negative') NOT NULL DEFAULT 'negative',
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`result_id`),
  KEY `sketch_id_idx` (`sketch_id`),
  KEY `configuration_id_idx` (`configuration_id`),
  CONSTRAINT `configuration_id` FOREIGN KEY (`configuration_id`) REFERENCES `PIPELINE_CONFIGURATION` (`configuration_id`),
  CONSTRAINT `sketch_id` FOREIGN KEY (`sketch_id`) REFERENCES `SKETCH` (`sketch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
