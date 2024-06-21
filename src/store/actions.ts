import { ActionTree } from "vuex"

// Actions drive changes to the store state.
// The state is expected to be synced with the in-memory database. All
// changes to state will occur through actions, so it is their
// responsibility to echo changes to the database.

export const actions: ActionTree<CMStory, CMStory> = {}
