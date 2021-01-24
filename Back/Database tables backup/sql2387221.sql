-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: sql2.freesqldatabase.com
-- Generation Time: Jan 24, 2021 at 11:16 AM
-- Server version: 5.5.54-0ubuntu0.12.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sql2387221`
--

-- --------------------------------------------------------

--
-- Table structure for table `Channel`
--

CREATE TABLE `Channel` (
  `name` varchar(32) NOT NULL,
  `description` varchar(512) NOT NULL,
  `createdBy` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `CommentsInPost`
--

CREATE TABLE `CommentsInPost` (
  `globalCommentID` int(10) UNSIGNED NOT NULL,
  `postID` int(10) UNSIGNED NOT NULL,
  `commentAccount` varchar(32) NOT NULL,
  `commentText` varchar(128) NOT NULL,
  `commentTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `LikesDislikesInPost`
--

CREATE TABLE `LikesDislikesInPost` (
  `postID` int(10) UNSIGNED NOT NULL,
  `likeAccount` varchar(32) NOT NULL,
  `interaction` enum('like','dislike') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `PhotosInPost`
--

CREATE TABLE `PhotosInPost` (
  `postID` int(10) UNSIGNED NOT NULL,
  `photoURL` varchar(128) NOT NULL,
  `orderInPost` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Post`
--

CREATE TABLE `Post` (
  `globalPostID` int(10) UNSIGNED NOT NULL,
  `title` varchar(32) NOT NULL,
  `posterAccount` varchar(32) NOT NULL,
  `postedTo` varchar(32) NOT NULL,
  `timeOfPost` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `GPSLatitude` decimal(8,6) DEFAULT NULL,
  `GPSLongitude` decimal(9,6) DEFAULT NULL,
  `score` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `SimilarTags`
--

CREATE TABLE `SimilarTags` (
  `tag` varchar(32) NOT NULL,
  `similarTag` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Tag`
--

CREATE TABLE `Tag` (
  `name` varchar(32) NOT NULL,
  `description` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `TagsInChannel`
--

CREATE TABLE `TagsInChannel` (
  `channelName` varchar(32) NOT NULL,
  `tagName` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `TagsInPost`
--

CREATE TABLE `TagsInPost` (
  `postID` int(10) UNSIGNED NOT NULL,
  `tagName` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `username` varchar(32) NOT NULL,
  `userPassword` varchar(32) NOT NULL,
  `emailAddress` varchar(64) NOT NULL,
  `levelOfAccess` enum('user','admin') NOT NULL DEFAULT 'user',
  `isPublic` tinyint(1) NOT NULL DEFAULT '1',
  `salt` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `UserFollowingChannel`
--

CREATE TABLE `UserFollowingChannel` (
  `username` varchar(32) NOT NULL,
  `channelName` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `UserFollowingTag`
--

CREATE TABLE `UserFollowingTag` (
  `username` varchar(32) NOT NULL,
  `tag` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `UserFollowingUser`
--

CREATE TABLE `UserFollowingUser` (
  `username` varchar(32) NOT NULL,
  `userBeingFollowed` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Channel`
--
ALTER TABLE `Channel`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `channel_already_exists` (`name`),
  ADD KEY `createdBy` (`createdBy`);

--
-- Indexes for table `CommentsInPost`
--
ALTER TABLE `CommentsInPost`
  ADD PRIMARY KEY (`globalCommentID`),
  ADD KEY `postID` (`postID`),
  ADD KEY `commentAccount` (`commentAccount`);

--
-- Indexes for table `LikesDislikesInPost`
--
ALTER TABLE `LikesDislikesInPost`
  ADD PRIMARY KEY (`postID`,`likeAccount`),
  ADD KEY `likeAccount` (`likeAccount`);

--
-- Indexes for table `PhotosInPost`
--
ALTER TABLE `PhotosInPost`
  ADD PRIMARY KEY (`postID`,`photoURL`);

--
-- Indexes for table `Post`
--
ALTER TABLE `Post`
  ADD PRIMARY KEY (`globalPostID`),
  ADD KEY `posterAccount` (`posterAccount`),
  ADD KEY `postedTo` (`postedTo`);

--
-- Indexes for table `SimilarTags`
--
ALTER TABLE `SimilarTags`
  ADD PRIMARY KEY (`tag`,`similarTag`),
  ADD KEY `similarTag` (`similarTag`);

--
-- Indexes for table `Tag`
--
ALTER TABLE `Tag`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `tag_already_exists` (`name`);

--
-- Indexes for table `TagsInChannel`
--
ALTER TABLE `TagsInChannel`
  ADD PRIMARY KEY (`channelName`,`tagName`),
  ADD KEY `tagName` (`tagName`);

--
-- Indexes for table `TagsInPost`
--
ALTER TABLE `TagsInPost`
  ADD PRIMARY KEY (`postID`,`tagName`),
  ADD KEY `tagName` (`tagName`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`username`),
  ADD UNIQUE KEY `email_already_exists` (`emailAddress`),
  ADD UNIQUE KEY `username_already_exists` (`username`);

--
-- Indexes for table `UserFollowingChannel`
--
ALTER TABLE `UserFollowingChannel`
  ADD PRIMARY KEY (`username`,`channelName`),
  ADD KEY `channelName` (`channelName`);

--
-- Indexes for table `UserFollowingTag`
--
ALTER TABLE `UserFollowingTag`
  ADD PRIMARY KEY (`username`,`tag`),
  ADD KEY `tag` (`tag`);

--
-- Indexes for table `UserFollowingUser`
--
ALTER TABLE `UserFollowingUser`
  ADD PRIMARY KEY (`username`,`userBeingFollowed`),
  ADD KEY `userBeingFollowed` (`userBeingFollowed`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `CommentsInPost`
--
ALTER TABLE `CommentsInPost`
  MODIFY `globalCommentID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `Post`
--
ALTER TABLE `Post`
  MODIFY `globalPostID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Channel`
--
ALTER TABLE `Channel`
  ADD CONSTRAINT `Channel_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `User` (`username`);

--
-- Constraints for table `CommentsInPost`
--
ALTER TABLE `CommentsInPost`
  ADD CONSTRAINT `CommentsInPost_ibfk_1` FOREIGN KEY (`postID`) REFERENCES `Post` (`globalPostID`),
  ADD CONSTRAINT `CommentsInPost_ibfk_2` FOREIGN KEY (`commentAccount`) REFERENCES `User` (`username`);

--
-- Constraints for table `LikesDislikesInPost`
--
ALTER TABLE `LikesDislikesInPost`
  ADD CONSTRAINT `LikesDislikesInPost_ibfk_1` FOREIGN KEY (`postID`) REFERENCES `Post` (`globalPostID`),
  ADD CONSTRAINT `LikesDislikesInPost_ibfk_2` FOREIGN KEY (`likeAccount`) REFERENCES `User` (`username`);

--
-- Constraints for table `PhotosInPost`
--
ALTER TABLE `PhotosInPost`
  ADD CONSTRAINT `PhotosInPost_ibfk_1` FOREIGN KEY (`postID`) REFERENCES `Post` (`globalPostID`);

--
-- Constraints for table `Post`
--
ALTER TABLE `Post`
  ADD CONSTRAINT `Post_ibfk_1` FOREIGN KEY (`posterAccount`) REFERENCES `User` (`username`),
  ADD CONSTRAINT `Post_ibfk_2` FOREIGN KEY (`postedTo`) REFERENCES `Channel` (`name`);

--
-- Constraints for table `SimilarTags`
--
ALTER TABLE `SimilarTags`
  ADD CONSTRAINT `SimilarTags_ibfk_1` FOREIGN KEY (`tag`) REFERENCES `Tag` (`name`),
  ADD CONSTRAINT `SimilarTags_ibfk_2` FOREIGN KEY (`similarTag`) REFERENCES `Tag` (`name`);

--
-- Constraints for table `TagsInChannel`
--
ALTER TABLE `TagsInChannel`
  ADD CONSTRAINT `TagsInChannel_ibfk_1` FOREIGN KEY (`channelName`) REFERENCES `Channel` (`name`),
  ADD CONSTRAINT `TagsInChannel_ibfk_2` FOREIGN KEY (`tagName`) REFERENCES `Tag` (`name`);

--
-- Constraints for table `TagsInPost`
--
ALTER TABLE `TagsInPost`
  ADD CONSTRAINT `TagsInPost_ibfk_1` FOREIGN KEY (`postID`) REFERENCES `Post` (`globalPostID`),
  ADD CONSTRAINT `TagsInPost_ibfk_2` FOREIGN KEY (`tagName`) REFERENCES `Tag` (`name`);

--
-- Constraints for table `UserFollowingChannel`
--
ALTER TABLE `UserFollowingChannel`
  ADD CONSTRAINT `UserFollowingChannel_ibfk_1` FOREIGN KEY (`username`) REFERENCES `User` (`username`),
  ADD CONSTRAINT `UserFollowingChannel_ibfk_2` FOREIGN KEY (`channelName`) REFERENCES `Channel` (`name`);

--
-- Constraints for table `UserFollowingTag`
--
ALTER TABLE `UserFollowingTag`
  ADD CONSTRAINT `UserFollowingTag_ibfk_1` FOREIGN KEY (`username`) REFERENCES `User` (`username`),
  ADD CONSTRAINT `UserFollowingTag_ibfk_2` FOREIGN KEY (`tag`) REFERENCES `Tag` (`name`);

--
-- Constraints for table `UserFollowingUser`
--
ALTER TABLE `UserFollowingUser`
  ADD CONSTRAINT `UserFollowingUser_ibfk_1` FOREIGN KEY (`username`) REFERENCES `User` (`username`),
  ADD CONSTRAINT `UserFollowingUser_ibfk_2` FOREIGN KEY (`userBeingFollowed`) REFERENCES `User` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
