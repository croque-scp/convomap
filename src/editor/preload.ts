import { contextBridge, ipcRenderer } from "electron"

// The types in this API object should be the same as those in
// ipc/fileReadWriteChannel.ts - they are not automatically checked by
// TypeScript
export const fileReadWriteApi = {
  readEventsFile: {
    /**
     * Reads the events file.
     */
    send: (): void => {
      ipcRenderer.send("read-events-file", {})
    },
    /**
     * Subscribes to the next events file read response.
     */
    singleResponse: (callback: (eventFile: string) => void): void => {
      ipcRenderer.once("read-events-file_response", (ipcEvent, eventFile) => {
        callback(eventFile)
      })
    },
  },
  writeEventsFile: {
    /**
     * Writes to an individual events file, backing up the old one.
     *
     * @param textContent - The contents of the new events file.
     */
    send: (textContent: string): void => {
      ipcRenderer.send("write-events-file", {
        params: textContent,
        // No custom response channel is used because I don't expect to be
        // saving multiple events that frequently when autosaving - would
        // be worth implementing if there is a save button that saves
        // multiple events, though
      })
    },
    /**
     * Subscribes to the next events file write response.
     */
    singleResponse: (callback: () => void): void => {
      ipcRenderer.once("write-events-file_response", callback)
    },
  },
}

contextBridge.exposeInMainWorld("fileReadWrite", fileReadWriteApi)
