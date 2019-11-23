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
Object.defineProperty(exports, "__esModule", { value: true });
const ts_nats_1 = require("ts-nats");
const events_1 = require("events");
class NatsTransport extends events_1.EventEmitter {
    constructor(url) {
        super();
        this.maxMessageSizeKB = 1024 * 1000;
        this.timeoutMS = 5000;
        this.url = url;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = yield ts_nats_1.connect({ servers: [this.url], payload: ts_nats_1.Payload.BINARY });
        });
    }
    send(channel, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.request(channel, this.timeoutMS, message);
                return true;
            }
            catch (err) {
                throw new Error(`NatsTransport->send->error: ${err.message}`);
            }
        });
    }
    consume(channel, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.subscribe(channel, (err, msg) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return;
                }
                if (msg.reply) {
                    const isLastData = msg.size === 0;
                    yield handler(msg.data, isLastData);
                    this.client.publish(msg.reply, '');
                }
            }));
        });
    }
}
exports.NatsTransport = NatsTransport;
//# sourceMappingURL=NatsTransport.js.map