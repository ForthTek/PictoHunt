
IF db_id('PictoHunt') IS NULL 
    CREATE DATABASE PictoHunt;

GO

# Names 32
# Email address 64
# URLs and comments 128
# Descriptions 512

CREATE TABLE Tag (
    name VARCHAR (32) NOT NULL,
    description VARCHAR (512) NOT NULL,
    CONSTRAINT tag_already_exists UNIQUE (name),
    PRIMARY KEY (name)
) ENGINE = INNODB;

CREATE TABLE SimilarTags (
    tag VARCHAR (32) NOT NULL,
    similarTag VARCHAR (32) NOT NULL,
    FOREIGN KEY (tag) REFERENCES Tag (name),
    FOREIGN KEY (similarTag) REFERENCES Tag (name),
    PRIMARY KEY (tag, similarTag)
) ENGINE = INNODB;

CREATE TABLE User (
    username VARCHAR (32) NOT NULL,
    userPassword VARCHAR (32) NOT NULL,
    emailAddress VARCHAR (64) NOT NULL,
    levelOfAccess ENUM ('user', 'admin') NOT NULL DEFAULT 'user',
    isPublic BOOLEAN DEFAULT TRUE,
    # Check that the email is in the valid format
    # DOESN'T WORK FOR SOME REASON
    CONSTRAINT email_invalid_format CHECK (emailAddress LIKE "%_@_%._%"),
    # Check that the email has not already been used
    CONSTRAINT email_already_exists UNIQUE (emailAddress),
    # Check that the username has not already been used
    CONSTRAINT username_already_exists UNIQUE (username),
    # Primary key is the username for this user
    PRIMARY KEY (username)
) ENGINE = INNODB;

CREATE TABLE Channel (
    name VARCHAR (32) NOT NULL,
    description VARCHAR (512) NOT NULL,
    createdBy VARCHAR (32) NOT NULL,
    FOREIGN KEY (createdBy) REFERENCES User (username),
    CONSTRAINT channel_already_exists UNIQUE (name),
    PRIMARY KEY (name)
) ENGINE = INNODB;

# Table to link tags to a channel
CREATE TABLE TagsInChannel (
    channelName VARCHAR (32) NOT NULL,
    tagName VARCHAR (32) NOT NULL,
    FOREIGN KEY (channelName) REFERENCES Channel (name),
    FOREIGN KEY (tagName) REFERENCES Tag (name),
    PRIMARY KEY (channelName, tagName)
) ENGINE = INNODB;

# Table to link users that follow a channel
CREATE TABLE UserFollowingChannel (
    username VARCHAR (32) NOT NULL,
    channelName VARCHAR (32) NOT NULL,
    FOREIGN KEY (username) REFERENCES User (username),
    FOREIGN KEY (channelName) REFERENCES Channel (name),
    PRIMARY KEY (username, channelName)
) ENGINE = INNODB;

# Table to link users that follow a tag
CREATE TABLE UserFollowingTag (
    username VARCHAR (32) NOT NULL,
    tag VARCHAR (32) NOT NULL,
    FOREIGN KEY (username) REFERENCES User (username),
    FOREIGN KEY (tag) REFERENCES Tag (name),
    PRIMARY KEY (username, tag)
) ENGINE = INNODB;

# Table to link users that follow a tag
CREATE TABLE UserFollowingUser (
    username VARCHAR (32) NOT NULL,
    userBeingFollowed VARCHAR (32) NOT NULL,
    FOREIGN KEY (username) REFERENCES User (username),
    FOREIGN KEY (userBeingFollowed) REFERENCES User (username),
    # Ensure that the user cannot follow themselves
    # DOESN'T WORK EITHER!!
    CONSTRAINT user_following_themselves CHECK  (username NOT LIKE userBeingFollowed),
    PRIMARY KEY (username, userBeingFollowed)
) ENGINE = INNODB;

CREATE TABLE Post (
    globalPostID INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR (32) NOT NULL,
    posterAccount VARCHAR (32) NOT NULL,
    postedTo VARCHAR (32) NOT NULL,
    timeOfPost TIMESTAMP NOT NULL,
    # Store GPS as lat and long precision decimal values
    # If they are NULL then don't display them
    GPSLatitude Decimal(8,6),
    GPSLongitude Decimal(9,6),
    FOREIGN KEY (posterAccount) REFERENCES User (username),
    FOREIGN KEY (postedTo) REFERENCES Channel (name),
    PRIMARY KEY (globalPostID)
) ENGINE = INNODB;

# Table to link tags to a post
CREATE TABLE TagsInPost (
    postID INTEGER UNSIGNED NOT NULL,
    tagName VARCHAR (32) NOT NULL,
    FOREIGN KEY (postID) REFERENCES Post (globalPostID),
    FOREIGN KEY (tagName) REFERENCES Tag (name),
    # Ensure that the post does not have too many tags
    PRIMARY KEY (postID, tagName)
) ENGINE = INNODB;

# Table to link photos to a post
CREATE TABLE PhotosInPost (
    postID INTEGER UNSIGNED NOT NULL,
    photoURL VARCHAR (128) NOT NULL,
    orderInPost INTEGER UNSIGNED NOT NULL,
    FOREIGN KEY (postID) REFERENCES Post (globalPostID),
    # Ensure the post does not have too many photos
    PRIMARY KEY (postID, photoURL)
) ENGINE = INNODB;

# Table to link comments to a post
CREATE TABLE CommentsInPost (
    # Use an int ID for comments. This allows us to sort by recently added much more efficiently
    globalCommentID INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    postID INTEGER UNSIGNED NOT NULL,
    commentAccount VARCHAR (32) NOT NULL,
    commentText VARCHAR (128) NOT NULL,
    commentTime TIMESTAMP NOT NULL,
    FOREIGN KEY (postID) REFERENCES Post (globalPostID),
    FOREIGN KEY (commentAccount) REFERENCES User (username),
    PRIMARY KEY (globalCommentID)
) ENGINE = INNODB;

# Table to link likes to a post
CREATE TABLE LikesDislikesInPost (
    postID INTEGER UNSIGNED NOT NULL,
    likeAccount VARCHAR (32) NOT NULL,
    interaction ENUM ('like', 'dislike') NOT NULL,
    FOREIGN KEY (postID) REFERENCES Post (globalPostID),
    FOREIGN KEY (likeAccount) REFERENCES User (username),
    # Just use the post and account as primary key to prevent a user making multiple interactions with a post
    PRIMARY KEY (postID, likeAccount)
) ENGINE = INNODB;







# SAMPLE DATA

# Create user
INSERT INTO User (username, userPassword, emailAddress) VALUES ("sol", "password", "a@a.a");
# Create private user 
# HAS INVELID EMAIL ADDRESS SO SHOULD FAIL BUT DOESN'T
INSERT INTO User (username, userPassword, emailAddress, isPublic) VALUES ( "sol-private", "password", "invalid email", FALSE );
# Create admin user
INSERT INTO User (username, userPassword, emailAddress, levelOfAccess) VALUES ( "sol-admin", "password", "name@site.co.uk", "admin");

# Create tag
INSERT INTO Tag (name, description) VALUES ("Cat", "Pictures of cats");
INSERT INTO Tag (name, description) VALUES ("Cute animals", "Pictures of cute animals");

# Create similar tag
INSERT INTO SimilarTags (tag, similarTag) VALUES ("Cat", "Cute animals");

# Create channel
INSERT INTO Channel (name, description, createdBy) VALUES ( "Cute animal pics", "This channel is for pictures of any cute animals!", "sol" );

# Add tags to channel
INSERT INTO TagsInChannel (channelName, tagName) VALUES ("Cute animal pics", "Cute animals"); 
INSERT INTO TagsInChannel (channelName, tagName) VALUES ("Cute animal pics", "Cat");

# Create a post
INSERT INTO Post (title, posterAccount, postedTo, timeOfPost, GPSLatitude, GPSLongitude) VALUES ("pics of my cute cat", "sol", "Cute animal pics", NOW(), 1.0, 1.0);
INSERT INTO PhotosInPost (postID, photoURL, orderInPost) VALUES (1, "www.cute-cats-in-my-area.co.uk/cat.png", 1);
# Second post
INSERT INTO Post ( title, posterAccount, postedTo, timeOfPost) VALUES ( "more pics of my cat", "sol", "Cute animal pics", NOW());
INSERT INTO PhotosInPost (postID, photoURL, orderInPost) VALUES (2, "www.cute-cats-in-my-area.co.uk/cat3.png", 2);
INSERT INTO PhotosInPost (postID, photoURL, orderInPost) VALUES (2, "www.cute-cats-in-my-area.co.uk/cat2.png", 1);

# Interact with the posts
INSERT INTO CommentsInPost (postID, commentAccount, commentText, commentTime) VALUES (1, "sol", "very nice post, well done!", NOW());
INSERT INTO CommentsInPost (postID, commentAccount, commentText, commentTime) VALUES (1, "sol", "this is my second comment!", NOW());
INSERT INTO LikesDislikesInPost (postID, likeAccount, interaction) VALUES (1, "sol", 'like');
INSERT INTO LikesDislikesInPost (postID, likeAccount, interaction) VALUES (2, "sol", 'dislike');

# Follow some things
INSERT INTO UserFollowingChannel (username, channelName) VALUES ("sol", "Cute animal pics");
INSERT INTO UserFollowingTag (username, tag) VALUES ("sol", "Cat");
# TRY TO FOLLOW THEMSELVES - SHOULD FAIL BUT DOESN'T
INSERT INTO UserFollowingUser (username, userBeingFollowed) VALUES ("sol", "sol");