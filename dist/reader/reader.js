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
const FileReader_1 = require("./FileReader");
const Transport_1 = require("../transport/Transport");
dotenv.config();
(function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const consoleOptionDefinitions = [
                { name: 'file_path', type: String },
                { name: 'transport', type: String },
                { name: 'channel', type: String },
            ];
            const defaultOptions = {
                transport: Transport_1.SupportedTransports.NATS,
                channel: 'transfer',
            };
            let consoleOptions = command_line_args_1.default(consoleOptionDefinitions);
            consoleOptions = Object.assign(defaultOptions, consoleOptions);
            const transport = yield Transport_1.Transport.getInstance(consoleOptions.transport);
            const reader = new FileReader_1.FileReader(consoleOptions.file_path, transport, consoleOptions.channel);
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
            yield reader.exec();
            setTimeout(() => {
                console.info('Reader done');
                process.exit(0);
            }, 0);
        }
        catch (err) {
            console.error(`Reader error:${err.message}`);
            process.exit(1);
        }
    });
}());
//# sourceMappingURL=reader.js.map