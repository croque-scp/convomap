PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE _meta (
  _version TEXT NOT NULL,
  _schemaVersion INTEGER NOT NULL,
  author TEXT NOT NULL,
  license TEXT NOT NULL,
  CHECK (rowid = 1)
);
INSERT INTO _meta VALUES('0.0.0',0,'Ross Williams','MIT');
CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  UNIQUE (name COLLATE NOCASE)
);
INSERT INTO events VALUES(0,'janetInquiresAboutInvitation','Janet hasn''t been invited to the party and wants to know why');
CREATE TABLE interactions (
  id INTEGER PRIMARY KEY,
  eventId INTEGER NOT NULL REFERENCES events (id),
  name TEXT NOT NULL,
  onStartActionId INTEGER REFERENCES actions (id),
  onMessagesEndActionId INTEGER REFERENCES actions (id),
  onEndActionId INTEGER REFERENCES actions (id),
  UNIQUE (eventId, name COLLATE NOCASE)
);
INSERT INTO interactions VALUES(0,0,'start',NULL,NULL,NULL);
INSERT INTO interactions VALUES(1,0,'noInviteApology',NULL,NULL,NULL);
INSERT INTO interactions VALUES(2,0,'dontLikeJanet',NULL,NULL,NULL);
INSERT INTO interactions VALUES(3,0,'noPartyLie',NULL,NULL,NULL);
INSERT INTO interactions VALUES(4,0,'notMyBirthdayLie',NULL,NULL,NULL);
CREATE TABLE options (
  -- Text of the option is kept in the strings table
  id INTEGER PRIMARY KEY,
  interactionId INTEGER NOT NULL REFERENCES interactions (id),
  conditionId INTEGER REFERENCES conditions (id),
  targetInteractionId INTEGER REFERENCES interactions (id),
  sortIndex INTEGER NOT NULL,
  UNIQUE (interactionId, sortIndex)
);
INSERT INTO options VALUES(0,0,NULL,1,0);
INSERT INTO options VALUES(1,0,NULL,2,1);
INSERT INTO options VALUES(2,0,NULL,3,2);
INSERT INTO options VALUES(3,2,NULL,NULL,0);
INSERT INTO options VALUES(4,2,NULL,NULL,1);
INSERT INTO options VALUES(5,3,NULL,4,0);
INSERT INTO options VALUES(6,3,NULL,NULL,1);
INSERT INTO options VALUES(7,3,NULL,NULL,2);
CREATE TABLE modifiers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  appliesToEvent BOOLEAN NOT NULL,
  appliesToInteraction BOOLEAN NOT NULL,
  appliesToOption BOOLEAN NOT NULL,
  appliesToMessageGroup BOOLEAN NOT NULL,
  UNIQUE (name COLLATE NOCASE)
);
INSERT INTO modifiers VALUES(0,'lie',0,0,0,1);
INSERT INTO modifiers VALUES(1,'mark',0,0,0,1);
INSERT INTO modifiers VALUES(2,'janet',0,0,0,1);
CREATE TABLE modifications (
  modifierId INTEGER NOT NULL REFERENCES modifiers (id),
  interactionId INTEGER REFERENCES interactions (id),
  optionId INTEGER REFERENCES options (id),
  messageGroupId INTEGER REFERENCES messageGroups (id),
  PRIMARY KEY (
    modifierId,
    interactionId,
    optionId,
    messageGroupId
  ),
  -- Check that exactly one modifier target is not null
  CHECK ((
    (interactionId IS NOT NULL) +
    (optionId IS NOT NULL) +
    (messageGroupId IS NOT NULL)
  ) == 1)
);
INSERT INTO modifications VALUES(0,NULL,0,NULL);
INSERT INTO modifications VALUES(2,NULL,NULL,0);
INSERT INTO modifications VALUES(2,NULL,NULL,2);
INSERT INTO modifications VALUES(2,NULL,NULL,4);
INSERT INTO modifications VALUES(2,NULL,NULL,5);
INSERT INTO modifications VALUES(2,NULL,NULL,7);
INSERT INTO modifications VALUES(2,NULL,NULL,9);
INSERT INTO modifications VALUES(0,NULL,6,NULL);
INSERT INTO modifications VALUES(0,NULL,7,NULL);
INSERT INTO modifications VALUES(2,NULL,NULL,10);
CREATE TABLE messageGroups (
  id INTEGER PRIMARY KEY,
  interactionId INTEGER NOT NULL REFERENCES interactions (id),
  onDisplayActionId INTEGER REFERENCES actions (id),
  sortIndex INTEGER NOT NULL,
  conditionId INTEGER REFERENCES conditions (id),
  conditionalRootId INTEGER NOT NULL REFERENCES messageGroups (id),
  UNIQUE (interactionId, sortIndex),
  -- Quick conditional validity check - must always start with ELSE
  CHECK (sortIndex != 0 OR conditionId IS NULL),
  CHECK (sortIndex != 0 OR conditionalRootId = id)
);
INSERT INTO messageGroups VALUES(0,0,NULL,0,NULL,0);
INSERT INTO messageGroups VALUES(1,0,NULL,1,NULL,1);
INSERT INTO messageGroups VALUES(2,0,NULL,2,NULL,2);
INSERT INTO messageGroups VALUES(3,1,NULL,0,NULL,3);
INSERT INTO messageGroups VALUES(4,1,NULL,1,NULL,4);
INSERT INTO messageGroups VALUES(5,1,NULL,2,NULL,5);
INSERT INTO messageGroups VALUES(6,2,NULL,0,NULL,6);
INSERT INTO messageGroups VALUES(7,2,NULL,1,NULL,7);
INSERT INTO messageGroups VALUES(8,3,NULL,0,NULL,8);
INSERT INTO messageGroups VALUES(9,3,NULL,1,NULL,9);
INSERT INTO messageGroups VALUES(10,4,NULL,0,NULL,10);
INSERT INTO messageGroups VALUES(11,4,NULL,1,NULL,11);
CREATE TABLE messages (
  -- Text of the message is kept in the strings table
  id INTEGER PRIMARY KEY,
  messageGroupId INTEGER NOT NULL REFERENCES messageGroups (id),
  onDisplayActionId INTEGER REFERENCES actions (id),
  sortIndex INTEGER NOT NULL,
  conditionId INTEGER REFERENCES conditions (id),
  conditionalRootId INTEGER NOT NULL REFERENCES messages (id),
  UNIQUE (messageGroupId, sortIndex),
  -- Quick conditional validity check - must always start with ELSE
  CHECK (conditionId IS NULL OR NOT sortIndex = 0),
  CHECK (sortIndex != 0 OR conditionalRootId = id)
);
INSERT INTO messages VALUES(0,0,NULL,0,NULL,0);
INSERT INTO messages VALUES(1,1,NULL,0,NULL,1);
INSERT INTO messages VALUES(2,2,NULL,0,NULL,2);
INSERT INTO messages VALUES(3,2,NULL,1,NULL,3);
INSERT INTO messages VALUES(4,3,NULL,0,NULL,4);
INSERT INTO messages VALUES(5,4,NULL,0,NULL,5);
INSERT INTO messages VALUES(6,4,NULL,1,NULL,6);
INSERT INTO messages VALUES(7,4,NULL,2,NULL,7);
INSERT INTO messages VALUES(8,5,NULL,0,NULL,8);
INSERT INTO messages VALUES(9,6,NULL,0,NULL,9);
INSERT INTO messages VALUES(10,6,NULL,1,NULL,10);
INSERT INTO messages VALUES(11,7,NULL,0,NULL,11);
INSERT INTO messages VALUES(12,7,NULL,1,NULL,12);
INSERT INTO messages VALUES(13,7,NULL,2,NULL,13);
INSERT INTO messages VALUES(14,8,NULL,0,NULL,14);
INSERT INTO messages VALUES(15,8,NULL,1,NULL,15);
INSERT INTO messages VALUES(16,8,NULL,2,NULL,16);
INSERT INTO messages VALUES(17,9,NULL,0,NULL,17);
INSERT INTO messages VALUES(18,10,NULL,0,NULL,18);
INSERT INTO messages VALUES(19,10,NULL,1,NULL,19);
INSERT INTO messages VALUES(20,11,NULL,0,NULL,20);
CREATE TABLE strings (
  id INTEGER PRIMARY KEY,
  string TEXT NOT NULL,
  optionId INTEGER REFERENCES options (id),
  messageId INTEGER REFERENCES messages (id),
  UNIQUE (optionId, messageId),
  CHECK ((
    (optionId IS NOT NULL) +
    (messageId IS NOT NULL)
  ) == 1)
);
INSERT INTO strings VALUES(0,'Hey, Mark.',NULL,0);
INSERT INTO strings VALUES(1,'Hi, Janet. What''s up?',NULL,1);
INSERT INTO strings VALUES(2,'I hear it''s your birthday party on Saturday.',NULL,2);
INSERT INTO strings VALUES(3,'Might I ask why I wasn''t invited?',NULL,3);
INSERT INTO strings VALUES(4,'I''m sorry - I forgot.',0,NULL);
INSERT INTO strings VALUES(5,'I just don''t like you.',1,NULL);
INSERT INTO strings VALUES(6,'There''s not going to be a birthday party.',2,NULL);
INSERT INTO strings VALUES(7,'I''m so sorry! I must have forgotten to send yours.',NULL,4);
INSERT INTO strings VALUES(8,'That''s alright! Don''t worry about it.',NULL,5);
INSERT INTO strings VALUES(9,'It happens to everyone.',NULL,6);
INSERT INTO strings VALUES(10,'I''ll see you on Saturday?',NULL,7);
INSERT INTO strings VALUES(11,'Sounds good! I''ll see you there.',NULL,8);
INSERT INTO strings VALUES(12,'Janet, in truth, I simply do not like you.',NULL,9);
INSERT INTO strings VALUES(13,'It really just comes down to that.',NULL,10);
INSERT INTO strings VALUES(14,'I see.',NULL,11);
INSERT INTO strings VALUES(15,'Well, thank you for being honest with me.',NULL,12);
INSERT INTO strings VALUES(16,'I''m glad I now know where we stand.',NULL,13);
INSERT INTO strings VALUES(17,'I''m sorry, Janet - I didn''t mean it like that.',3,NULL);
INSERT INTO strings VALUES(18,'Good.',4,NULL);
INSERT INTO strings VALUES(19,'I''m so sorry - you must have heard incorrectly.',NULL,14);
INSERT INTO strings VALUES(20,'I''m not having a birthday party on Saturday.',NULL,15);
INSERT INTO strings VALUES(21,'Who told you that?',NULL,16);
INSERT INTO strings VALUES(22,'Are you sure? I trust my sources.',NULL,17);
INSERT INTO strings VALUES(23,'It''s not even my birthday for months.',5,NULL);
INSERT INTO strings VALUES(24,'It was cancelled.',6,NULL);
INSERT INTO strings VALUES(25,'I was lying.',7,NULL);
INSERT INTO strings VALUES(26,'Well that''s not true.',NULL,18);
INSERT INTO strings VALUES(27,'You invited me last year.',NULL,19);
INSERT INTO strings VALUES(28,'You must be misremembering.',NULL,20);
CREATE TABLE actions (
  id INTEGER PRIMARY KEY
);
CREATE TABLE actionTerms (
  id INTEGER PRIMARY KEY,
  actionId INTEGER NOT NULL REFERENCES actions (id),
  actionFunctionId INTEGER NOT NULL REFERENCES actionFunctions (id),
  sortIndex INTEGER NOT NULL,
  conditionId INTEGER REFERENCES conditions (id),
  conditionalRootId INTEGER NOT NULL REFERENCES messageGroups (id),
  UNIQUE (actionId, sortIndex),
  -- Quick conditional validity check - must always start with ELSE
  CHECK (sortIndex != 0 OR conditionId IS NULL),
  CHECK (sortIndex != 0 OR conditionalRootId = id)
);
CREATE TABLE actionFunctions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  -- appliesTo?
  UNIQUE (name COLLATE NOCASE)
);
CREATE TABLE actionFunctionArgumentTypes (
  actionFunctionId INTEGER NOT NULL REFERENCES actionFunctions (id),
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  type TEXT NOT NULL, -- string, number, interaction, null?
  optional BOOLEAN NOT NULL,
  sortIndex INTEGER NOT NULL,
  UNIQUE (actionFunctionId, sortIndex)
);
CREATE TABLE actionTermFunctionArguments (
  actionTermId INTEGER NOT NULL REFERENCES actionTerms (id),
  sortIndex INTEGER NOT NULL,
  UNIQUE (actionTermId, sortIndex)
  -- TODO Somehow indicate the value of the argument
);
CREATE TABLE conditions (
  id INTEGER PRIMARY KEY
);
CREATE TABLE conditionTerms (
  id INTEGER PRIMARY KEY,
  conditionId INTEGER NOT NULL REFERENCES conditions (id),
  sortIndex INTEGER NOT NULL,
  operator TEXT, -- and, or, not, ever
  conditionFunctionId INTEGER REFERENCES conditionFunctions (id),
  -- TODO How are arguments stored?
  CHECK ((
    (operator IS NOT NULL) +
    (conditionFunctionId IS NOT NULL)
  ) == 1),
  UNIQUE (conditionId, sortIndex)
);
CREATE TABLE conditionFunctions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  UNIQUE (name COLLATE NOCASE)
);
CREATE TABLE conditionFunctionArgumentTypes (
  conditionFunctionId INTEGER NOT NULL REFERENCES conditionFunctions (id),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- string, number, interaction, null?
  optional BOOLEAN NOT NULL,
  sortIndex INTEGER NOT NULL,
  UNIQUE (conditionFunctionId, sortIndex)
);
CREATE TABLE conditionTermFunctionArguments (
  conditionTermId INTEGER NOT NULL REFERENCES conditionTerms (id),
  sortIndex INTEGER NOT NULL,
  UNIQUE (conditionTermId, sortIndex)
  -- TODO Somehow indicate the value of the argument
);
COMMIT;
