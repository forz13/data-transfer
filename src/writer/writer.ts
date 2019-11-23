import commandLineArgs from 'command-line-args';
import * as ProgressBarDefault from 'progress';
import * as dotenv from 'dotenv';
import { FileWriter } from './FileWriter';
import { Transport } from '../transport/Transport';

dotenv.config();

(async function run(): Promise<void> {
  const consoleOptionDefinitions = [
    { name: 'file_path', type: String },
    { name: 'transport', type: String },
    { name: 'channel', type: String },
  ];

  const consoleOptions = commandLineArgs(consoleOptionDefinitions);
  const transport = await Transport.getInstance(consoleOptions.transport);
  const writer = new FileWriter(consoleOptions.file_path, transport, consoleOptions.channel);
  console.info('Writer waiting data');
  try {
    await writer.exec();
    writer.on('start', (fileMetaData) => {
      console.info(`Start writing file ${fileMetaData.name}`);
      const ProgressBar = ProgressBarDefault.default;
      const bar = new ProgressBar('Downloading [:bar] :percent :elapseds', {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total: fileMetaData.size,
      });
      writer.on('send', (chunkLength) => {
        bar.tick(chunkLength);
      });
    });
    writer.on('end', () => {
      setTimeout(() => {
        console.info('Writer done');
        process.exit(0);
      }, 0);
    });
  } catch (err) {
    console.error(`Writer error:${err.message}`);
    process.exit(1);
  }
}());
