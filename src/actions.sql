-- Actions to perform when doing stuff
CREATE TABLE actions (
  id INTEGER PRIMARY KEY
);

-- Action terms apply multiple action functions to a single action
CREATE TABLE actionTerms (
  id INTEGER PRIMARY KEY,
  actionId INTEGER NOT NULL REFERENCES actions (id),
  sortIndex INTEGER NOT NULL,
  conditionId INTEGER REFERENCES conditions (id),
  actionFunctionId INTEGER NOT NULL REFERENCES actionFunctions (id),
  UNIQUE (actionId, sortIndex)
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
  type TEXT NOT NULL, -- string, number, interaction, null?
  optional BOOLEAN NOT NULL,
  sortIndex INTEGER NOT NULL,
  UNIQUE (actionFunctionId, sortIndex)
);

-- Arguments that have been passed to individual action terms
-- Validation is the responsibility of the runtime
CREATE TABLE actionTermFunctionArguments (
  actionTermId INTEGER NOT NULL,
  actionFunctionId INTEGER NOT NULL,
  FOREIGN KEY (actionTermId, actionFunctionId)
    REFERENCES actionTerms (id, actionFunctionId),
  sortIndex INTEGER NOT NULL,
  UNIQUE (actionTermId, actionFunctionId, sortIndex)
  -- TODO Somehow indicate the value of the argument
);
