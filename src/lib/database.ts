import initSqlJs, { Database, QueryExecResult } from "sql.js"

/**
 * Create a database from file contents.
 *
 * @param dbFile - Contents of the SQLite DB file as a buffer.
 * @returns Database object.
 */
export async function prepareDatabase(dbFile?: Uint8Array): Promise<Database> {
  // Initialise SQLite
  const SQL = await initSqlJs()
  return new SQL.Database(dbFile)
  // TODO Create a new database if none exists
}

/**
 * A database that automatically regenerates the UI state on the completion
 * of any change.
 */
export class RegenerativeDatabase {
  constructor(public db: Database) {}

  /**
   * Regenerates the application state from the database, taking into
   * account any changes. Replaces an existing state in-place.
   */
  regenerateState(state: CMStory): void {
    const get = <T>(tableName: string) => {
      queryResultToDataNode<T>(this.db.exec(`SELECT * FROM ${tableName}`))
    }
    Object.assign(state, {
      events: get<CMEvent>("events"),
      interactions: get<CMInteraction>("interactions"),
      options: get<CMOption>("options"),
      modifiers: get<CMModifier>("modifiers"),
      modifications: get<CMModification>("modifications"),
      messageGroups: get<CMMessageGroup>("messageGroups"),
      messages: get<CMMessage>("messages"),
      strings: get<CMString>("strings"),

      actions: get<CMAction>("actions"),
      actionTerms: get<CMActionTerm>("actionTerms"),
      actionFunctions: get<CMActionFunction>("actionFunctions"),
      actionFunctionArgumentTypes: get<CMActionFunctionArgumentType>(
        "actionFunctionArgumentTypes"
      ),
      actionTermFunctionArguments: get<CMActionTermFunctionArgument>(
        "actionTermFunctionArguments"
      ),

      conditions: get<CMCondition>("conditions"),
      conditionTerms: get<CMConditionTerm>("conditionTerms"),
      conditionFunctions: get<CMConditionFunction>("conditionFunctions"),
      conditionFunctionArgumentTypes: get<CMConditionFunctionArgumentType>(
        "conditionFunctionArgumentTypes"
      ),
      conditionTermFunctionArguments: get<CMConditionTermFunctionArgument>(
        "conditionTermFunctionArguments"
      ),
    })
  }
}

/**
 * Converts a SQL query result to a Convomap data node. Assumes only one
 * SELECT statement has been executed.
 */
export function queryResultToDataNode<CMData>(
  results: QueryExecResult[]
): CMData[] {
  if (results.length !== 1) throw new Error("Wrong number of results")
  const [result] = results
  return result.values.map((row) => {
    // SQLite data comes in untyped, so may as well pop an assertion,
    // assuming that it's correctly-typed
    return <CMData>Object.assign(
      {},
      ...result.columns.map((column, columnIndex) => {
        return { [column]: row[columnIndex] }
      })
    )
  })
}
