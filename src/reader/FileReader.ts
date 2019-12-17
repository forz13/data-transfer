import fs from 'fs';
import path from 'path';
import util from 'util';
import { EventEmitter } from 'events';

const fsStatAsync = util.promisify(fs.stat);

export interface FileMetaData {
    name: string;
    filePath: string;
    fileSizeInByte: number;
}

export class FileReader extends EventEmitter {
    private fileMetaData: FileMetaData;

    private filePath: string;

    private readStream: fs.ReadStream;

    constructor(filePath: string) {
      super();
      this.filePath = filePath;
    }

    async stream(maxMessageSizeKB: number): Promise<fs.ReadStream> {
      if (!this.readStream) {
        this.readStream = fs.createReadStream(this.filePath, { highWaterMark: maxMessageSizeKB });
      }
      return this.readStream;
    }

    async meta(): Promise<FileMetaData> {
      if (!this.fileMetaData) {
        const fileName = path.basename(this.filePath);
        const fileStats = await fsStatAsync(this.filePath);
        const fileSizeInByte = fileStats.size;
        this.fileMetaData = {
          name: fileName,
          filePath: this.filePath,
          fileSizeInByte,
        };
      }
      return this.fileMetaData;
    }
}
