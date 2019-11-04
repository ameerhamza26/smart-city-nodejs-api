CREATE TABLE smartcitydb.users (
	id BIGINT NOT NULL AUTO_INCREMENT,
	username varchar(100) NOT NULL,
	email varchar(100) NOT NULL,
	CONSTRAINT users_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_general_ci;

ALTER TABLE smartcitydb.users ADD register_token NVARCHAR NULL;
ALTER TABLE smartcitydb.users ADD register_token_expiry DATETIME NULL;
ALTER TABLE smartcitydb.users ADD is_email_verified BOOL NULL;
ALTER TABLE smartcitydb.users DROP COLUMN is_email_verified;
ALTER TABLE smartcitydb.users ADD is_email_verified BOOL DEFAULT false NULL;
ALTER TABLE smartcitydb.users ADD CONSTRAINT users_UN UNIQUE KEY (username);
ALTER TABLE smartcitydb.users ADD CONSTRAINT users_unique_email UNIQUE KEY (email);
ALTER TABLE smartcitydb.users ADD blockchain_account_id varchar(100) NULL;
ALTER TABLE smartcitydb.users ADD password varchar(100) NULL;


CREATE TABLE smartcitydb.sessions (
	id BIGINT NOT NULL AUTO_INCREMENT,
	user_id BIGINT NULL,
	token varchar(100) NOT NULL,
	status varchar(100) NULL,
	CONSTRAINT sessions_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_general_ci;

CREATE TABLE smartcitydb.config (
	factory_address varchar(100) NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_general_ci;


CREATE TABLE smartcitydb.campaigns (
	id BIGINT NOT NULL AUTO_INCREMENT,
	user_id BIGINT NULL,
	campaign_address varchar(100) NULL,
	CONSTRAINT campaigns_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_general_ci;

CREATE TABLE smartcitydb.posts (
	id BIGINT NOT NULL AUTO_INCREMENT,
	user_id varchar(100) NOT NULL,
	post_id varchar(100) NOT NULL,
	CONSTRAINT posts_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_general_ci;


alter table config
add column post_factory_address varchar(100);

alter table config 
drop column post_factory_address;

alter table config 
add column type varchar(100);


CREATE TABLE smartcitydb.deals (
	id BIGINT NOT NULL AUTO_INCREMENT,
	points NUMERIC NULL,
	coins NUMERIC NULL,
	CONSTRAINT deals_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_general_ci;

alter table users
add COLUMN points Bigint DEFAULT 0;

alter table users
add COLUMN coins DECIMAL(19 , 4 ) DEFAULT 0.00 ;


CREATE TABLE smartcitydb.offers (
	id BIGINT NOT NULL AUTO_INCREMENT,
	title varchar(100) NULL,
	`from` varchar(100) NULL,
	value BIGINT NULL,
	CONSTRAINT offers_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_general_ci;



alter table users
add column first_name text default null;


alter table users
add column last_name text default null;


alter table users
add COLUMN created_at datetime;


alter table users
add COLUMN updated_at datetime;
