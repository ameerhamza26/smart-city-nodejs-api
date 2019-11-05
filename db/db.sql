CREATE TABLE `campaigns` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `campaign_address` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `config` (
  `factory_address` varchar(100) NOT NULL,
  `type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `deals` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `points` decimal(10,0) DEFAULT NULL,
  `coins` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;


CREATE TABLE `offers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `from` varchar(100) DEFAULT NULL,
  `value` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `posts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) NOT NULL,
  `post_id` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;


CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8;


CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `register_token_expiry` datetime DEFAULT NULL,
  `register_token` varchar(1000) DEFAULT NULL,
  `is_email_verified` tinyint(1) DEFAULT 0,
  `blockchain_account_id` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `first_name` text DEFAULT NULL,
  `last_name` text DEFAULT NULL,
  `blockchain_password` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `role` text DEFAULT 'Default',
  `image` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_UN` (`username`),
  UNIQUE KEY `users_unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8;


CREATE TABLE `post_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `points` bigint(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


CREATE TABLE `brands` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;


CREATE TABLE `brand_offers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `brand_id` bigint(20) DEFAULT NULL,
  `offer` text DEFAULT NULL,
  `points` bigint(20) DEFAULT NULL,
  `expiry` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;


CREATE TABLE `brand_location` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` text DEFAULT NULL,
  `latitude` text DEFAULT NULL,
  `longitude` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `brand_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `brand_users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `brand_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;



INSERT INTO smartcitydb.post_types (title,points,description,updated_at,created_at) VALUES 
('Community garden',100,'Build an urban garden and add some color to your neighborhood! You can plant vegetables, flowers, fresh condiments and more for all to enjoy.
What you’ll need: a good communal area to use (ask permission first from your local authorities!), flowers, seeds, plants, soil, working tools, water.',NULL,NULL)
,('Outdoor cleanup',50,'Many parks and natural spots in your area could use some cleaning. Take a few friends and simply pick up trash together. The results will definitely benefit all passersby and inhabitants.
What you’ll need: trash bags, gloves.',NULL,NULL)
,('Recycling corner',50,'Recycling is one of the easiest ways to benefit the environment. In a central place in your community, place containers to collect plastic bottles and wrappers, old batteries, paper or anything else you can think of. Encourage friends, neighbors and anyone else passing by to recycle! Just make sure you know where to deposit and actually recycle what you collect.
What you’ll need: containers (as big as you can get them!) and signs promoting your efforts.',NULL,NULL)
,('Clean water',30,'Access to clean water isn’t a privilege everyone has these days. There are many ways to support organizations such as charity:water or water.org. You could volunteer with them doing anything from helping in events to writing thank you notes. Use this infographic to let your community know what they can do to save water.',NULL,NULL)
,('Plant tree',10,'Trees have amazing benefits: they provide homes for animals, provide shade, reduce wind speed, absorb carbon dioxide and so much more. Fill up a local bare spot by planting trees for all to enjoy.
What you’ll need: trees to plant, water, working tools.',NULL,NULL)
;