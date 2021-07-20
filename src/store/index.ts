import { createStore } from "vuex"
import { mutations } from "./mutations"
import { actions } from "./actions"
import { prepareDatabase, RegenerativeDatabase } from "../lib/database"

const db = new RegenerativeDatabase(await prepareDatabase())

const freshStory = {
  _meta: {
    _convomap: "Made with Convomap https://github.com/rossjrw/convomap",
    _convomapVersion: "0.0.0", // TODO Get version
  },
  events: [],
  interactions: [],
  options: [],
  modifiers: [],
  modifications: [],
  messageGroups: [],
  messages: [],
  strings: [],

  actions: [],
  actionTerms: [],
  actionFunctions: [],
  actionFunctionArgumentTypes: [],
  actionTermFunctionArguments: [],

  conditions: [],
  conditionTerms: [],
  conditionFunctions: [],
  conditionFunctionArgumentTypes: [],
  conditionTermFunctionArguments: [],
}

export const store = createStore<CMStory>({
  strict: process.env.NODE_ENV !== "production",
  state() {
    const story = Object.assign({}, freshStory)
    db.regenerateState(story)
    return story
  },
  mutations,
  actions,
})
