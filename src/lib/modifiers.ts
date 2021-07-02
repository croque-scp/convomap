export type ModifierConfig = {
  modifiers: {
    modifierCategories: ModifierCategoriesConfig
  }
} & {
  allowCustomModifiers: boolean
}

export type Modifier = string

/**
 * The node types that accept modifiers.
 *
 * Note that modifiers apply to the messageSettings type, which is extended
 * by message and messageGroup.
 */
type NodesThatAcceptModifiers =
  | "message"
  | "messageGroup"
  | "option"
  | "interaction"

type ModifierCategoriesConfig = {
  id: string
  requires: string[]
  canBeUsedOn: Record<NodesThatAcceptModifiers, boolean>
  modifiers: string[]
}[]
