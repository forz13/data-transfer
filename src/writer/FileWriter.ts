import fs, { WriteStream } from 'fs';
import { EventEmitter } from 'events';
import { IWriter } from './IWriter';
import { ITransport } from '../transport/ITransport';

class FileWriter extends EventEmitter implements IWriter {
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
    this.setDir(downloadDir);
  }

  private setDir(downloadDir: string): void{
    let needCreateDir = false;
    try {
      const dirInfo = fs.statSync(downloadDir);
      if (!dirInfo.isDirectory()) {
        needCreateDir = true;
      }
    } catch (err) {
      needCreateDir = true;
    }
    if (needCreateDir) {
      fs.mkdirSync(downloadDir);
    }
    this.downloadDir = downloadDir;
  }

  async exec(): Promise<void> {
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
