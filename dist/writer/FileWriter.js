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
const events_1 = require("events");
const util_1 = __importDefault(require("util"));
const fsStatAsync = util_1.default.promisify(fs_1.default.stat);
const fsMkdirAsync = util_1.default.promisify(fs_1.default.mkdir);
class FileWriter extends events_1.EventEmitter {
    constructor(downloadDir, transport, channel) {
        super();
        this.isWriteProcessStart = false;
        this.isWriteProcessEnd = false;
        this.transport = transport;
        this.channel = channel;
        this.downloadDir = downloadDir;
    }
    createDir() {
        return __awaiter(this, void 0, void 0, function* () {
            let needCreateDir = false;
            try {
                const dirInfo = yield fsStatAsync(this.downloadDir);
                if (!dirInfo.isDirectory()) {
                    needCreateDir = true;
                }
            }
            catch (err) {
                needCreateDir = true;
            }
            if (needCreateDir) {
                yield fsMkdirAsync(this.downloadDir);
            }
        });
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createDir();
            yield this.transport.consume(this.channel, this.dataHandler.bind(this));
        });
    }
    dataHandler(data, isLastData) {
        return new Promise((resolve, reject) => {
            if (!this.isWriteProcessStart) {
                this.isWriteProcessStart = true;
                const fileMetaData = JSON.parse(data.toString());
                this.writeStream = fs_1.default.createWriteStream(`${this.downloadDir}/${fileMetaData.name}`);
                this.emit('start', fileMetaData);
            }
            if (isLastData) {
                this.writeStream.close();
                this.isWriteProcessEnd = true;
                this.emit('end');
                return resolve(true);
            }
            this.writeStream.write(data, (err) => {
                if (err) {
                    return reject(err);
                }
                this.emit('send', data.length);
                return resolve(true);
            });
        });
    }
}
exports.FileWriter = FileWriter;
//# sourceMappingURL=FileWriter.js.map