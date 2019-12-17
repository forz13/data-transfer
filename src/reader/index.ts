import commandLineArgs from 'command-line-args';
import * as ProgressBarDefault from 'progress';
import * as dotenv from 'dotenv';
import { FileReader } from './FileReader';
import { Transport, SupportedTransports } from '../transport/Transport';
import { Reader } from './Reader';

dotenv.config();


(async function run(): Promise<void> {
  try {
    const consoleOptionDefinitions = [
      { name: 'file_path', type: String },
      { name: 'transport', type: String },
      { name: 'channel', type: String },
    ];
    const defaultOptions = {
      transport: SupportedTransports.NATS,
      channel: 'transfer',
    };
    let consoleOptions = commandLineArgs(consoleOptionDefinitions);
    consoleOptions = Object.assign(defaultOptions, consoleOptions);
    const transport = await Transport.getInstance(consoleOptions.transport);
    const fileReader = new FileReader(consoleOptions.file_path);
    const fileMetaData = await fileReader.meta();
    const readStream = await fileReader.stream(transport.maxMessageSizeKB);
    const reader = new Reader(readStream, fileMetaData, transport);
    const ProgressBar = ProgressBarDefault.default;
    const bar = new ProgressBar('Uploading [:bar] :percent :elapseds', {
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: fileMetaData.fileSizeInByte,
    });
    reader.on('send', (chunkLength) => {
      bar.tick(chunkLength);
    });
    console.info('Reader start sending file data');
    await reader.run(consoleOptions.channel);
    setTimeout(() => {
      console.info('Reader done');
      process.exit(0);
    }, 0);
  } catch (err) {
    console.error(`Reader error:${err.message}`);
    process.exit(1);
  }
}());
