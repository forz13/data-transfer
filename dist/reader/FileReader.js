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
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const events_1 = require("events");
class FileReader extends events_1.EventEmitter {
    constructor(filePath, transport, channel) {
        super();
        this.filePath = filePath;
        this.fileName = path_1.default.basename(filePath);
        const fileStat = fs_1.default.statSync(this.filePath);
        this.fileSizeInByte = fileStat.size;
        this.transport = transport;
        this.channel = channel;
        this.readStream = fs_1.default.createReadStream(this.filePath, {
            highWaterMark: this.transport.maxMessageSizeKB,
        });
    }
    fileSize() {
        return this.fileSizeInByte;
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            const firstChunk = Buffer.from(JSON.stringify({
                name: this.fileName,
                size: this.fileSizeInByte,
            }));
            yield this.send(firstChunk);
            return new Promise((resolve, reject) => {
                this.readStream.on('data', (chunk) => __awaiter(this, void 0, void 0, function* () {
                    this.readStream.pause();
                    try {
                        yield this.send(chunk);
                        this.emit('send', chunk.length);
                        this.readStream.resume();
                    }
                    catch (err) {
                        reject(err);
                    }
                }));
                this.readStream.on('error', (err) => reject(err));
                this.readStream.on('end', () => __awaiter(this, void 0, void 0, function* () {
                    yield this.send(Buffer.from(''));
                    this.readStream.close();
                    resolve();
                }));
            });
        });
    }
    send(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transport.send(this.channel, message);
            }
            catch (err) {
                throw new Error(`FileReader->send error->${err.message}`);
            }
        });
    }
}
exports.FileReader = FileReader;
//# sourceMappingURL=FileReader.js.map