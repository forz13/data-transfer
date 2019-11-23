import commandLineArgs from 'command-line-args';
import * as ProgressBarDefault from 'progress';
import * as dotenv from 'dotenv';
import { FileReader } from './FileReader';
import { Transport } from '../transport/Transport';

dotenv.config();

(async function run(): Promise<void> {
  const consoleOptionDefinitions = [
    { name: 'file_path', type: String },
    { name: 'transport', type: String },
    { name: 'channel', type: String },
  ];
  const consoleOptions = commandLineArgs(consoleOptionDefinitions);
  let transport;
  let reader;
  try {
    transport = await Transport.getInstance(consoleOptions.transport);
  } catch (err) {
    console.error(`Transport error: ${err.message}`);
    return;
  }
  try {
    reader = new FileReader(consoleOptions.file_path, transport, consoleOptions.channel);
  } catch (err) {
    console.error(`FileReader error: ${err.message}`);
    return;
  }

  try {
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
