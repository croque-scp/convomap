import { createApp } from "vue"
import { store } from "./store"
import Editor from "./components/Editor.vue"

const app = createApp(Editor)
app.use(store)
app.mount("body")
