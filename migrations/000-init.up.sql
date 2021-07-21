CREATE TABLE _meta (
  _version TEXT NOT NULL,
  _schemaVersion INTEGER NOT NULL,
  author TEXT NOT NULL,
  license TEXT NOT NULL,
  CHECK (rowid = 1)
);

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
  onStartActionId INTEGER REFERENCES actions (id),
  onMessagesEndActionId INTEGER REFERENCES actions (id),
  onEndActionId INTEGER REFERENCES actions (id),
  UNIQUE (eventId, name COLLATE NOCASE)
);

CREATE TABLE options (
  id INTEGER PRIMARY KEY,
  interactionId INTEGER NOT NULL REFERENCES interactions (id),
  conditionId INTEGER REFERENCES conditions (id),
  targetInteractionId INTEGER REFERENCES interactions (id),
  sortIndex INTEGER NOT NULL,
  UNIQUE (interactionId, sortIndex)
);

CREATE TABLE modifiers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  appliesToEvent BOOLEAN NOT NULL,
  appliesToInteraction BOOLEAN NOT NULL,
  appliesToOption BOOLEAN NOT NULL,
  appliesToMessageGroup BOOLEAN NOT NULL,
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
  CHECK ((
    (interactionId IS NOT NULL) +
    (optionId IS NOT NULL) +
    (messageGroupId IS NOT NULL)
  ) == 1)
);

CREATE TABLE messageGroups (
  id INTEGER PRIMARY KEY,
  interactionId INTEGER NOT NULL REFERENCES interactions (id),
  onDisplayActionId INTEGER REFERENCES actions (id),
  sortIndex INTEGER NOT NULL,
  conditionId INTEGER REFERENCES conditions (id),
  conditionalRootId INTEGER NOT NULL REFERENCES messageGroups (id),
  UNIQUE (interactionId, sortIndex),
  CHECK (sortIndex != 0 OR conditionId IS NULL),
  CHECK (sortIndex != 0 OR conditionalRootId = id)
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  messageGroupId INTEGER NOT NULL REFERENCES messageGroups (id),
  onDisplayActionId INTEGER REFERENCES actions (id),
  sortIndex INTEGER NOT NULL,
  conditionId INTEGER REFERENCES conditions (id),
  conditionalRootId INTEGER NOT NULL REFERENCES messages (id),
  UNIQUE (messageGroupId, sortIndex),
  CHECK (conditionId IS NULL OR NOT sortIndex = 0),
  CHECK (sortIndex != 0 OR conditionalRootId = id)
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

-- Actions to perform when doing stuff
CREATE TABLE actions (
  id INTEGER PRIMARY KEY
);

-- Action terms apply multiple action functions to a single action
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

-- Custom action functions defined by the user
CREATE TABLE actionFunctions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  -- appliesTo?
  UNIQUE (name COLLATE NOCASE)
);

-- Type signatures for action functions
CREATE TABLE actionFunctionArgumentTypes (
  actionFunctionId INTEGER NOT NULL REFERENCES actionFunctions (id),
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  type TEXT NOT NULL, -- string, number, interaction, null?
  optional BOOLEAN NOT NULL,
  sortIndex INTEGER NOT NULL,
  UNIQUE (actionFunctionId, sortIndex)
);

-- Arguments that have been passed to individual action terms
-- Validation is the responsibility of the runtime
CREATE TABLE actionTermFunctionArguments (
  actionTermId INTEGER NOT NULL REFERENCES actionTerms (id),
  sortIndex INTEGER NOT NULL,
  UNIQUE (actionTermId, sortIndex)
  -- TODO Somehow indicate the value of the argument
);
-- A condition is a series of condition terms
CREATE TABLE conditions (
  id INTEGER PRIMARY KEY
);

-- A condition term is either a single boolean condition or an operator
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

-- Custom condition functions defined by the user
CREATE TABLE conditionFunctions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  UNIQUE (name COLLATE NOCASE)
);

-- Type signatures for condition functions
CREATE TABLE conditionFunctionArgumentTypes (
  conditionFunctionId INTEGER NOT NULL REFERENCES conditionFunctions (id),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- string, number, interaction, null?
  optional BOOLEAN NOT NULL,
  sortIndex INTEGER NOT NULL,
  UNIQUE (conditionFunctionId, sortIndex)
);

-- Arguments that have been passed to individual condition function terms
-- Validation is the responsibility of the runtime
CREATE TABLE conditionTermFunctionArguments (
  conditionTermId INTEGER NOT NULL REFERENCES conditionTerms (id),
  sortIndex INTEGER NOT NULL,
  UNIQUE (conditionTermId, sortIndex)
  -- TODO Somehow indicate the value of the argument
);

