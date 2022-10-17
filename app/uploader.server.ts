import fs from "fs";
import lineByLine from "n-readlines";

import { appendDataToImportRecord, createImportRecord } from "./models/import";

class DbWriter {
  _MAX_BUFFER_SIZE = 10;
  _buffer: string[] = [];
  _recordId?: string;

  constructor(recordId: string) {
    console.log("creating new writer");
    this._recordId = recordId;
  }

  async appendToBuffer(line: string) {
    this._buffer.push(line);
    await this.checkBuffer();
  }

  resetBuffer() {
    this._buffer.length = 0;
  }

  async writeFinalBuffer() {
    if (this._buffer.length > 0) {
      await this.writeBufferToDb(this._buffer);
    }
  }

  async checkBuffer() {
    if (this._buffer.length >= this._MAX_BUFFER_SIZE) {
      await this.writeBufferToDb(this._buffer);
    }
  }

  async writeBufferToDb(buffer: string[]) {
    console.log("writing to db", buffer);
    if (!this._recordId) throw new Error("no record id");
    const data = buffer.map((line) => {
      const [first_name, last_name, id] = line.split(",");
      return {
        first_name,
        last_name,
        id: parseInt(id),
      };
    });
    await appendDataToImportRecord(this._recordId, data);
    this.resetBuffer();
  }
}

export async function insertCsvIntoDb(
  filepath: string,
  filename: string,
  deviceId: string,
  sessionId: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const liner = new lineByLine(filepath);
    const recordId = await createImportRecord(deviceId, filename, sessionId);
    const dbWriter = new DbWriter(recordId);

    let count = 0;
    let line: Buffer | false;

    console.log("starting to read file...");
    while ((line = liner.next())) {
      count++;
      const lineString = line.toString("utf-8");
      if (count === 1) {
        console.log("first line", lineString);
      } else {
        console.log("appending to buffer");
        await dbWriter.appendToBuffer(lineString);
      }
    }

    fs.unlink(filepath, (err) => {
      if (err) {
        console.log("error deleting file", err);
      }
      console.log("upload file deleted");
    });

    await dbWriter.writeFinalBuffer();

    console.log("done reading file");
    resolve();
  });
}
