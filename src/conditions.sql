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
  ) == 1)
  UNIQUE (conditionId, sortIndex)
);

-- Custom condition functions defined by the user
CREATE TABLE conditionFunctions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  appliesToOption BOOLEAN NOT NULL,
  appliesToInteraction BOOLEAN NOT NULL,
  appliesToMessageGroup BOOLEAN NOT NULL,
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
