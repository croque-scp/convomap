CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  UNIQUE (name COLLATE NOCASE)
);

CREATE TABLE interactions (
  id INTEGER PRIMARY KEY,
  eventId INTEGER NOT NULL REFERENCES events (id),
  name TEXT NOT NULL,
  UNIQUE (eventId, name COLLATE NOCASE)
);

CREATE TABLE options (
  -- Text of the option is kept in the strings table
  id INTEGER PRIMARY KEY,
  conditionId INTEGER NOT NULL REFERENCES conditions (id),
  interactionId INTEGER NOT NULL REFERENCES interactions (id),
  targetInteractionId INTEGER REFERENCES interactions (id),
  sortIndex INTEGER NOT NULL,
  UNIQUE (interactionId, sortIndex)
);

CREATE TABLE modifiers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  -- appliesTo?
  UNIQUE (name COLLATE NOCASE)
);

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

CREATE TABLE messageGroups (
  id INTEGER PRIMARY KEY,
  interactionId INTEGER NOT NULL REFERENCES interactions (id),
  sortIndex INTEGER NOT NULL,
  conditionId INTEGER REFERENCES conditions (id),
  UNIQUE (interactionId, sortIndex),
  -- Quick conditional validity check - must always start with ELSE
  CHECK (conditionId IS NULL OR NOT sortIndex = 0)
);

CREATE TABLE messages (
  -- Text of the message is kept in the strings table
  id INTEGER PRIMARY KEY,
  messageGroupId INTEGER NOT NULL REFERENCES messageGroups (id),
  sortIndex INTEGER NOT NULL,
  conditionId INTEGER REFERENCES conditions (id),
  UNIQUE (messageGroupId, sortIndex),
  -- Quick conditional validity check - must always start with ELSE
  CHECK (conditionId IS NULL OR NOT sortIndex = 0)
);

-- All translatable strings are kept in the strings table.
-- Identical strings are considered different when they differ in context
-- so strings may be duplicated when their parent differs.
-- Anything that uses the strings table may only have one entry - objects
-- that require multiple strings should be split into multiple objects
-- (i.e. the strings table has no sortIndex).
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
