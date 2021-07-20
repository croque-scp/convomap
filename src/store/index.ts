import { createStore } from "vuex"
import { mutations } from "./mutations"
import { actions } from "./actions"

export const store = createStore<CMStory>({
  strict: process.env.NODE_ENV !== "production",
  state() {},
  mutations,
  actions,
})
