import stream from 'stream';
import { EventEmitter } from 'events';
import { FileMetaData } from './FileReader';
import { ITransport } from '../transport/ITransport';

export class Reader extends EventEmitter {
    private stream: stream.Readable;

    private metaData: FileMetaData;

    private transport: ITransport;

    constructor(stream: stream.Readable, metaData: FileMetaData, transport: ITransport) {
      super();
      this.stream = stream;
      this.metaData = metaData;
      this.transport = transport;
    }

    async run(channel: string): Promise<void> {
      const firstChunk = Buffer.from(JSON.stringify({
        name: this.metaData.name,
        size: this.metaData.fileSizeInByte,
      }));
      await this.transport.send(channel, firstChunk);
      return new Promise((resolve, reject) => {
        this.stream.on('data', async (chunk) => {
          this.stream.pause();
          try {
            await this.transport.send(channel, chunk);
            this.emit('send', chunk.length);
            this.stream.resume();
          } catch (err) {
            reject(err);
          }
        });
        this.stream.on('error', (err) => reject(err));
        this.stream.on('end', async () => {
          await this.transport.send(channel, Buffer.from(''));
          this.stream.destroy();
          resolve();
        });
      });
    }
}
