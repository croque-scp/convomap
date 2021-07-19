/**
 * All structural types defined by Convomap are prefixed with 'CM' to avoid
 * ambiguity with pre-existng types with similar names (e.g. Event, String).
 */

/**
 * The main events object.
 *
 * @property _meta - Meta information about the story.
 * @property events - Events i.e. interaction groupings.
 * @property interactions - Interactions (messages followed by options).
 * @property options - Options that result from interactions.
 * @property modifiers - Modifiers that can be applied to other objects.
 * @property modifications - Relationships between modifiers and other objects.
 * @property messageGroups - Groups of messages to collate configuration.
 * @property messages - Messages to be used in message groups.
 * @property strings - Translatable strings to be used in the story.
 *
 * @property actions - Executable action registrations.
 * @property actionTerms - The action functions assigned to each action.
 * @property actionFunctions - User-defined action functions.
 * @property actionFunctionArgumentTypes - Action function type declarations.
 * @property actionTermFunctionArguments - Arguments passed to actions.
 *
 * @property conditions - Condition registrations.
 * @property conditionTerms - Condition functions assigned to each condition.
 * @property conditionFunctions - User-defined condition functions.
 * @property conditionFunctionArgumentTypes - Condition type declarations.
 * @property conditionTermFunctionArguments - Arguments passed to conditions.
 */
export type CMStory = {
  _meta: CMMeta
  events: CMEvent[]
  interactions: CMInteraction[]
  options: CMOption[]
  modifiers: CMModifier[]
  modifications: CMModification[]
  messageGroups: CMMessageGroup[]
  messages: CMMessage[]
  strings: CMString[]

  actions: CMAction[]
  actionTerms: CMActionTerm[]
  actionFunctions: CMActionFunction[]
  actionFunctionArgumentTypes: CMActionFunctionArgumentType[]
  actionTermFunctionArguments: CMActionTermFunctionArgument[]

  conditions: CMCondition[]
  conditionTerms: CMConditionTerm[]
  conditionFunctions: CMConditionFunction[]
  conditionFunctionArgumentTypes: CMConditionFunctionArgumentType[]
  conditionTermFunctionArguments: CMConditionTermFunctionArgument[]
}

/**
 * Meta information about the story.
 *
 * TODO Fields like author, copyright, description
 * TODO Store in DB?
 */
export type CMMeta = {
  _convomap: string
  _convomapVersion: string
}

/**
 * An event that contains a series of interactions.
 *
 * @property name - A unique name for the event.
 * @property summary - A short summary of the event to remind the writer
 * what it is.
 */
export type CMEvent = CMNode & {
  name: string
  summary: string
}

/**
 * A single interaction containing messages and subsequent options to display.
 *
 * @property eventId - The ID of the event that contains this interaction.
 * @property name - The user-defined name of the event, which is unique per
 * each event.
 * @property onStartActionId - The ID of the action to execute when this
 * interaction begins (or null for no action).
 * @property onMessagesEndActionId - The ID of the action to execute when
 * this interaction finishes displaying its messages, but before the
 * options have been displayed (or null for no action).
 * @property onEndActionId - The ID of the action to execute when this
 * interaction finishes. If there are no options, will execute immediately
 * after onMessagesEnd (or null for no action).
 */
export type CMInteraction = CMNode & {
  eventId: number
  name: string
  onStartActionId: number | null
  onMessagesEndActionId: number | null
  onEndActionId: number | null
}

/**
 * An option that appears and will be presented to the player during an
 * interaction.
 *
 * @property interactionId - The ID of the interaction that contains this
 * option.
 * @property conditionId - The ID of the condition that must be passed in
 * order for this option to appear, or null if there is no such condition.
 * @property targetInteractionId - The ID of the interaction to jump to
 * when this option is selected, or null if there is no target interaction.
 * @property sortIndex - A number indicating the sort order of options in
 * this interaction.
 */
export type CMOption = CMNode & {
  interactionId: number
  conditionId: number | null
  targetInteractionId: number | null
  sortIndex: number
}

/**
 * Modifiers to be applied to various data nodes to effect changes on the
 * UI, and can be read in the implementation runtime for custom effects.
 *
 * @property name - Name of the modifier.
 * @property appliesToEvent - Whether this modifier can be used on events.
 * @property appliesToInteraction - Whether this modifier can be used
 * on interactions.
 * @property appliesToOption - Whether this modifier can be used on options.
 * @property appliesToMessageGroup - Whether this modifier can be used
 * on message groups.
 */
export type CMModifier = CMNode & {
  name: string
  appliesToEvent: boolean
  appliesToInteraction: boolean
  appliesToOption: boolean
  appliesToMessageGroup: boolean
}

/**
 * A record of the application of a single modifier to a single data node.
 *
 * @property modifierId - The ID of the modifier to apply.
 *
 * Exactly one of the following properties will not be null.
 *
 * @property interactionId - The ID of the interaction to be modified.
 * @property optionId - The ID of the option to be modified.
 * @property messageGroupId - The ID of the message group to be modified.
 */
export type CMModification = {
  modifierId: number
  interactionId: number | null
  optionId: number | null
  messageGroupId: number | null
}

/**
 * A batch of messages, used to reduce duplication of settings that would
 * have been applied to each of them individually.
 *
 * @property interactionId - The ID of the interaction that contains this
 * message group.
 * @property onDiplayActionId - The ID of the action to execute when
 * displaying this message group, or null.
 */
export type CMMessageGroup = CMNode & {
  interactionId: number
  onDisplayActionId: number | null
} & CMSortable &
  CMConditional

/**
 * A single message.
 *
 * @property messageGroupId - The ID of the message group that contains
 * this message.
 * @property onDiplayActionId - The ID of the action to execute when
 * displaying this message, or null.
 */
export type CMMessage = CMNode & {
  messageGroupId: number
  onDisplayActionId: number | null
} & CMSortable &
  CMConditional

/**
 * A single string, to be eventually displayed to the user. Strings stored
 * here are eligible for translation during a story's internationalisation
 * process (unlike, for example, event names).
 *
 * @property string - The text of the string.
 *
 * Exactly one of the following properties will not be null.
 *
 * @property optionId - The ID of the option that this string corresponds
 * to, or null if it does not.
 * @property messageId - The ID of the message that this string corresponds
 * to, or null if it does not.
 */
export type CMString = {
  string: string
  optionId: number | null
  messageId: number | null
} & CMNode

/* Actions */

/**
 * An action to execute, which contains any number of individual action terms.
 */
export type CMAction = CMNode

/**
 * A single term of an action. All action terms are action functions.
 *
 * @property actionId - The ID of the action that contains this term.
 * @property actionFunctionId - The ID of the action function represented
 * by this term.
 */
export type CMActionTerm = {
  actionId: number
  actionFunctionId: number
} & CMNode &
  CMSortable &
  CMConditional

/**
 * A custom action function either defined by the user or created by default
 * by Convomap.
 *
 * @property name - The name of the action function, which is how it will
 * appear when used as an action term.
 * @property summary - A description of what the action does.
 */
export type CMActionFunction = {
  name: string
  summary: string
} & CMNode

/**
 * A single argument declaration for an action function. Arguments passed
 * to the action when it is used must be compliant with these declarations.
 *
 * @property actionFunctionId - The ID of the action function for which
 * this is an argument declaration.
 * @property name - The name of the argument.
 * @property summary - A description of what the argument is.
 * @property type - TODO - some indication of the argument's type.
 * @property optional - Whether this argument is optional. Required
 * arguments must precede optional arguments, if there are any.
 */
export type CMActionFunctionArgumentType = {
  actionFunctionId: number
  name: string
  type: string
  optional: boolean
} & CMSortable

/**
 * An argument passed to an action function in a given action term.
 *
 * @property actionTermId - The ID of the action term to which this
 * argument has been passed.
 *
 * TODO Work out how to indicate the value of the argument
 */
export type CMActionTermFunctionArgument = {
  actionTermId: number
} & CMSortable

/* Conditions */

/**
 * An condition, which contains any number of individual conditionterms.
 */
export type CMCondition = CMNode

/**
 * A single term of a condition. Condition terms are either condition
 * functions or operators. Operators are stored in postfix notation (per
 * sortIndex).
 *
 * @property conditionId - The ID of the condition that contains this term.
 *
 * Exactly one of the following will not be null.
 *
 * @property operator - A condition operator that consumes condition terms
 * from the stack.
 * @property conditionFunctionId - The ID of the condition function represented
 * by this term.
 */
export type CMConditionTerm = {
  conditionId: number
  operator: CMConditionOperator | null
  conditionFunctionId: number | null
} & CMNode &
  CMSortable &
  CMConditional

/**
 * A custom condition function either defined by the user or created by default
 * by Convomap.
 *
 * @property name - The name of the condition function, which is how it will
 * appear when used as a condition term.
 * @property summary - A description of what the function checks for.
 */
export type CMConditionFunction = {
  name: string
  summary: string
} & CMNode

/**
 * A single argument declaration for a condition function. Arguments passed
 * to the condition when it is used must be compliant with these declarations.
 *
 * @property conditionFunctionId - The ID of the condition function for which
 * this is an argument declaration.
 * @property name - The name of the argument.
 * @property summary - A description of what the argument is.
 * @property type - TODO - some indication of the argument's type.
 * @property optional - Whether this argument is optional. Required
 * arguments must precede optional arguments, if there are any.
 */
export type CMConditionFunctionArgumentType = {
  conditionFunctionId: number
  name: string
  type: string
  optional: boolean
} & CMSortable

/**
 * An argument passed to an condition function in a given condition term.
 *
 * @property conditionTermId - The ID of the condition term to which this
 * argument has been passed.
 *
 * TODO Work out how to indicate the value of the argument
 */
export type CMConditionTermFunctionArgument = {
  conditionTermId: number
} & CMSortable

/* Supplementary types */

/**
 * Supplementary type for all data nodes that are referenced by others.
 * Per Convomap's database-oriented paradigm, all nodes have a numeric ID
 * which is used to track foreign key relations.
 *
 * @property id - This node's numeric ID in its table.
 *
 * @abstract
 */
export type CMNode = {
  id: number
}

/**
 * Supplementary type for data nodes that have a user-defined sort order.
 * These nodes are always assumed to be ordered by this value.
 *
 * @property sortIndex - A number indicating this node's sort position in
 * its parent.
 *
 * @abstract
 */
export type CMSortable = {
  sortIndex: number
}

/**
 * Supplementary type for data nodes that are 'Conditional', i.e. taking
 * the form of an if-elif-else structure.
 *
 * Ordered by sortIndex, the items contained in the 'else' branch of the
 * Conditional must come first. The first such item is the root. There must
 * always be at least one 'else' item, even if it is empty.
 *
 * @property conditionId - The ID of the condition (if this is an 'if' or
 * 'elif' branch), or null (if this is an 'else' branch).
 * @property conditionalRootId - The ID of the node in the current set that
 * is the root of the current Conditional, i.e. the first 'else' item.
 *
 * @abstract
 */
export type CMConditional = {
  conditionId: number | null
  conditionalRootId: number
}

/**
 * Postfix operators for condition terms.
 */
export type CMConditionOperator = "AND" | "OR" | "NOT" | "EVER"
