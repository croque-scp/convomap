import { IpcChannelInterface, IpcRequest } from "./ipcChannelInterface"
import { IpcMainEvent } from "electron"
import path from "path"
import fs from "fs"
import { execSync } from "child_process"

const eventsFilePath = process.argv[0]
if (!eventsFilePath) {
  throw new Error("No event file provided")
}
console.info(`The events file is`, path.resolve(eventsFilePath))

// The types in this IPC channel should be the same as those in preload.ts -
// they are not automatically checked by TypeScript

/**
 * Reads the events file that was specified on the command line and sends
 * its contents back to the renderer process.
 */
export class ReadEventsFileChannel implements IpcChannelInterface {
  name = "read-events-file"

  handle(event: IpcMainEvent, request: IpcRequest<never>): void {
    const eventsFile = fs.readFileSync(path.resolve(eventsFilePath), "utf-8")

    if (!request.responseChannel) {
      request.responseChannel = `${this.name}_response`
    }
    event.sender.send(request.responseChannel, eventsFile)
  }
}

/**
 * Writes a string to the events file, replacing its existing contents, and
 * backing up the previous contents to another file.
 *
 * Called with a single argument which is a string representing the
 * contents of the new file.
 */
export class WriteEventsFileChannel implements IpcChannelInterface {
  name = "write-events-file"

  handle(event: IpcMainEvent, request: IpcRequest<string>): void {
    if (!request.responseChannel) {
      request.responseChannel = `${this.name}_response`
    }
    const textContent = request.params
    // Create a specific backup. The file name is hashed against the
    // current date, time, and most recent commit.
    // TODO Handle case when this fails / git not in use
    const commitHash = execSync("git rev-parse HEAD", {
      encoding: "utf-8",
    }).substring(0, 8)
    // The time is rounded to the previous half hour so there's not an
    // overwhelming number of backups
    const halfAnHour = 1000 * 60 * 30
    const currentTime = new Date(
      Math.floor(new Date().getTime() / halfAnHour) * halfAnHour
    )
    const backupFilePath = eventsFilePath.replace(
      ".json",
      `.bak.${currentTime.toISOString()}-${commitHash}.json`
    )
    // Back up the events file, failing if a file with the same name exists
    fs.copyFileSync(
      path.resolve(eventsFilePath),
      path.resolve(backupFilePath),
      fs.constants.COPYFILE_EXCL
    )
    // Write the new file
    fs.writeFileSync(path.resolve(eventsFilePath), textContent)
    // Inform the renderer process that the file has been saved
    event.sender.send(request.responseChannel)
  }
}
