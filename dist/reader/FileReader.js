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
const util_1 = __importDefault(require("util"));
const events_1 = require("events");
const fsStatAsync = util_1.default.promisify(fs_1.default.stat);
class FileReader extends events_1.EventEmitter {
    constructor(filePath) {
        super();
        this.filePath = filePath;
    }
    stream(maxMessageSizeKB) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.readStream) {
                this.readStream = fs_1.default.createReadStream(this.filePath, { highWaterMark: maxMessageSizeKB });
            }
            return this.readStream;
        });
    }
    meta() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fileMetaData) {
                const fileName = path_1.default.basename(this.filePath);
                const fileStats = yield fsStatAsync(this.filePath);
                const fileSizeInByte = fileStats.size;
                this.fileMetaData = {
                    name: fileName,
                    filePath: this.filePath,
                    fileSizeInByte,
                };
            }
            return this.fileMetaData;
        });
    }
}
exports.FileReader = FileReader;
//# sourceMappingURL=FileReader.js.map