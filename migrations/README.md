# Migrations

This directory contains migrations between different versions of a Convomap
database. A Convomap file (`.convomap`) is just an SQLite database.

Every Convomap database contains a `_meta` table with a single row. Column
`_schemaVersion` of this row contains the index of the most recent
migration that has been applied to this database.

When Convomap loads a file, it first checks this schema version.

- A version that is lower than the highest-numbered migration file that
  exists indicates that the file was made in an old version of Convomap.
  All 'up' migrations that are numbered higher than the schema version are
  applied to it, resulting in a database that is compatible with the user's
  installed version of Convomap, and then the schema version number is
  updated to match.
- A version that is higher than the highest-numbered migration file
  indicates that it was made in a future version of Convomap. Convomap will
  prompt the user to update, and will not proceed with loading the file (at
  risk of destroying data).

This keeps your Convomap file up to date, but it does mean that everyone
working on the same project needs to be using the same version of Convomap.

Migration 0 is special &mdash; it contains the initial migration needed to
create a new Convomap project from scratch. It therefore contains the
initial tables versions as they are per the current version of Convomap. A
Convomap project created via migration 0 is already the latest version and
does not need any further migrations applied to it. The `_schemaVersion`
for a Convomap file created in this way is the same as the highest-numbered
migration file, even though that migration was never applied to it.

As a result, the Convomap repository only actually contains the database
definition for the current version, not the definition for all versions.
This is fine, because Convomap files &mdash; both `.convomap` files and
`.convomap.sql` dumps &mdash; contain their own table definitions. All they
need is the migrations in order to make them compatible with the current
version.
