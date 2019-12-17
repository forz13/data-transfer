import fs, { WriteStream } from 'fs';
import { EventEmitter } from 'events';
import util from 'util';
import { ITransport } from '../transport/ITransport';

const fsStatAsync = util.promisify(fs.stat);
const fsMkdirAsync = util.promisify(fs.mkdir);

class FileWriter extends EventEmitter {
  private downloadDir: string;

  private readonly channel: string;

  private transport: ITransport;

  private writeStream: WriteStream;

  private isWriteProcessStart= false;

  private isWriteProcessEnd=false;

  constructor(downloadDir: string, transport: ITransport, channel: string) {
    super();
    this.transport = transport;
    this.channel = channel;
    this.downloadDir = downloadDir;
  }

  private async createDir(): Promise<void> {
    let needCreateDir = false;
    try {
      const dirInfo = await fsStatAsync(this.downloadDir);
      if (!dirInfo.isDirectory()) {
        needCreateDir = true;
      }
    } catch (err) {
      needCreateDir = true;
    }
    if (needCreateDir) {
      await fsMkdirAsync(this.downloadDir);
    }
  }

  async exec(): Promise<void> {
    await this.createDir();
    await this.transport.consume(this.channel, this.dataHandler.bind(this));
  }

  dataHandler(data: Buffer, isLastData?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.isWriteProcessStart) {
        this.isWriteProcessStart = true;
        const fileMetaData = JSON.parse(data.toString());
        this.writeStream = fs.createWriteStream(`${this.downloadDir}/${fileMetaData.name}`);
        this.emit('start', fileMetaData);
      }
      if (isLastData) {
        this.writeStream.close();
        this.isWriteProcessEnd = true;
        this.emit('end');
        return resolve(true);
      }
      this.writeStream.write(data, (err: Error) => {
        if (err) {
          return reject(err);
        }
        this.emit('send', data.length);
        return resolve(true);
      });
    });
  }
}

export { FileWriter };
