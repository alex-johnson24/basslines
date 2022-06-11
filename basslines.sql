drop table dbo.roles;

CREATE TABLE roles(
    id UNIQUEIDENTIFIER DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    flag int NOT NULL,
    createdatetime DATETIME2(3) CONSTRAINT roles_createddate DEFAULT (SYSDATETIME()),
    updatedatetime DATETIME2(3),
    PRIMARY KEY (id)
);

CREATE TRIGGER roles_updatedatetime ON dbo.roles
AFTER UPDATE 
AS
  UPDATE dbo.roles
  SET updatedatetime = SYSDATETIME()
  FROM Inserted i;

drop table dbo.studios;

create table studios(
  id UNIQUEIDENTIFIER DEFAULT NEWID(),
  name NVARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
);

drop table dbo.users;

create table users(
	id UNIQUEIDENTIFIER DEFAULT NEWID(),
	username NVARCHAR(100) NOT NULL,
	hpassword NVARCHAR(100) NOT NULL,
	salt NVARCHAR(100) NOT NULL,
	roleid UNIQUEIDENTIFIER,
  studioid UNIQUEIDENTIFIER,
  disablereviewing BIT NOT NULL,
	createdatetime DATETIME2(3) CONSTRAINT users_createddate DEFAULT (SYSDATETIME()),
  updatedatetime DATETIME2(3),
  PRIMARY KEY (id),
  CONSTRAINT FK_users_roleid FOREIGN KEY (roleid) REFERENCES roles(id) on delete set null,
  CONSTRAINT FK_users_studioid FOREIGN KEY (studioid) REFERENCES studios(id) on delete set null
);

CREATE TRIGGER users_updatedatetime ON dbo.users
AFTER UPDATE 
AS
  UPDATE dbo.users
  SET updatedatetime = SYSDATETIME()
  FROM Inserted i;

drop table dbo.genres;

CREATE TABLE genres(
    id UNIQUEIDENTIFIER DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    createdatetime DATETIME2(3) CONSTRAINT genres_createddate DEFAULT (SYSDATETIME()),
    updatedatetime DATETIME2(3),
    PRIMARY KEY (id)
);

CREATE TRIGGER genres_updatedatetime ON dbo.genres
AFTER UPDATE 
AS
  UPDATE dbo.genres
  SET updatedatetime = SYSDATETIME()
  FROM Inserted i;

drop table songs;

create table songs(
	id UNIQUEIDENTIFIER DEFAULT NEWID(),
	title NVARCHAR(100) NOT NULL,
	artist NVARCHAR(100) NOT NULL,
	userid UNIQUEIDENTIFIER NOT NULL,
	genreid UNIQUEIDENTIFIER,
  reviewerid UNIQUEIDENTIFIER NOT NULL,
	rating int CONSTRAINT CK_songs_rating Check ( rating >= 0 and rating <= 10 ),
	createdatetime DATETIME2(3) CONSTRAINT songs_createddate DEFAULT (SYSDATETIME()),
    updatedatetime DATETIME2(3),
    PRIMARY KEY (id),
    CONSTRAINT FK_songs_genreid FOREIGN KEY (genreid) REFERENCES genres(id) on delete set null,
    CONSTRAINT FK_songs_userid FOREIGN KEY (userid) REFERENCES users(id) on delete set null,
    CONSTRAINT FK_songs_reviewerid FOREIGN KEY (reviewerid) REFERENCES users(id) on delete set null
);

CREATE TRIGGER songs_updatedatetime ON dbo.songs
AFTER UPDATE 
AS
  UPDATE dbo.songs
  SET updatedatetime = SYSDATETIME()
  FROM Inserted i;