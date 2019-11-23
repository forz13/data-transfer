"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_args_1 = __importDefault(require("command-line-args"));
const ProgressBarDefault = __importStar(require("progress"));
const dotenv = __importStar(require("dotenv"));
const FileWriter_1 = require("./FileWriter");
const Transport_1 = require("../transport/Transport");
dotenv.config();
(function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const consoleOptionDefinitions = [
                { name: 'download_dir', type: String },
                { name: 'transport', type: String },
                { name: 'channel', type: String },
            ];
            const defaultOptions = {
                download_dir: './downloads',
                transport: Transport_1.SupportedTransports.NATS,
                channel: 'transfer',
            };
            let consoleOptions = command_line_args_1.default(consoleOptionDefinitions);
            consoleOptions = Object.assign(defaultOptions, consoleOptions);
            const transport = yield Transport_1.Transport.getInstance(consoleOptions.transport);
            const writer = new FileWriter_1.FileWriter(consoleOptions.download_dir, transport, consoleOptions.channel);
            console.info('Writer waiting data');
            yield writer.exec();
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
        }
        catch (err) {
            console.error(`Writer error:${err.message}`);
            process.exit(1);
        }
    });
}());
//# sourceMappingURL=writer.js.map