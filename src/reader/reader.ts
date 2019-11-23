import commandLineArgs from 'command-line-args';
import * as ProgressBarDefault from 'progress';
import * as dotenv from 'dotenv';
import { FileReader } from './FileReader';
import { Transport, SupportedTransports } from '../transport/Transport';

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
    const reader = new FileReader(consoleOptions.file_path, transport, consoleOptions.channel);

    const ProgressBar = ProgressBarDefault.default;
    const bar = new ProgressBar('Uploading [:bar] :percent :elapseds', {
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: reader.fileSize(),
    });
    reader.on('send', (chunkLength) => {
      bar.tick(chunkLength);
    });
    console.info('Reader start sending file data');
    await reader.exec();
    setTimeout(() => {
      console.info('Reader done');
      process.exit(0);
    }, 0);
  } catch (err) {
    console.error(`Reader error:${err.message}`);
    process.exit(1);
  }
}());
