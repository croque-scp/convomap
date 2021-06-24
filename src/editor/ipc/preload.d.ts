import { fileReadWriteApi } from "../electronPreload"

declare global {
  interface Window {
    fileReadWrite: typeof fileReadWriteApi
  }
}

export {}
