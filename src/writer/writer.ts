import commandLineArgs from 'command-line-args';
import * as ProgressBarDefault from 'progress';
import * as dotenv from 'dotenv';
import { FileWriter } from './FileWriter';
import { SupportedTransports, Transport } from '../transport/Transport';

dotenv.config();

(async function run(): Promise<void> {
  try {
    const consoleOptionDefinitions = [
      { name: 'download_dir', type: String },
      { name: 'transport', type: String },
      { name: 'channel', type: String },
    ];
    const defaultOptions = {
      download_dir: './downloads',
      transport: SupportedTransports.NATS,
      channel: 'transfer',
    };

    let consoleOptions = commandLineArgs(consoleOptionDefinitions);
    consoleOptions = Object.assign(defaultOptions, consoleOptions);
    const transport = await Transport.getInstance(consoleOptions.transport);
    const writer = new FileWriter(consoleOptions.download_dir, transport, consoleOptions.channel);
    console.info('Writer waiting data');
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
