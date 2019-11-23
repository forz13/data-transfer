import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import { IReader } from './IReader';

import { ITransport } from '../transport/ITransport';

class FileReader extends EventEmitter implements IReader {
    private readonly filePath: string;

    private readonly fileName: string;

    private readonly fileSizeInByte: number;

    private readonly channel: string;

    private transport: ITransport;

    private readStream: fs.ReadStream;

    constructor(filePath: string, transport: ITransport, channel: string) {
      super();
      this.filePath = filePath;
      this.fileName = path.basename(filePath);
      const fileStat = fs.statSync(this.filePath);
      this.fileSizeInByte = fileStat.size;
      this.transport = transport;
      this.channel = channel;
      this.readStream = fs.createReadStream(this.filePath, {
        highWaterMark: this.transport.maxMessageSizeKB,
      });
    }

    public fileSize(): number {
      return this.fileSizeInByte;
    }

    async exec(): Promise<void> {
      const firstChunk = Buffer.from(JSON.stringify({
        name: this.fileName,
        size: this.fileSizeInByte,
      }));
      await this.send(firstChunk);
      return new Promise((resolve, reject) => {
        this.readStream.on('data', async (chunk) => {
          this.readStream.pause();
          try {
            await this.send(chunk);
            this.emit('send', chunk.length);
            this.readStream.resume();
          } catch (err) {
            reject(err);
          }
        });
        this.readStream.on('error', (err) => reject(err));
        this.readStream.on('end', async () => {
          await this.send(Buffer.from(''));
          this.readStream.close();
          resolve();
        });
      });
    }

    protected async send(message: Buffer): Promise<boolean> {
      try {
        await this.transport.send(this.channel, message);
      } catch (err) {
        throw new Error(`FileReader->send error->${err.message}`);
      }
      return true;
    }
}

export { FileReader };
