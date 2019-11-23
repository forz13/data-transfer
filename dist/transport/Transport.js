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
const NatsTransport_1 = require("./NatsTransport");
var SupportedTransports;
(function (SupportedTransports) {
    SupportedTransports["NATS"] = "nats";
    SupportedTransports["WEBSOCKET"] = "websocket";
})(SupportedTransports || (SupportedTransports = {}));
exports.SupportedTransports = SupportedTransports;
class Transport {
    static getInstance(transportType) {
        return __awaiter(this, void 0, void 0, function* () {
            let transport;
            switch (transportType) {
                case SupportedTransports.NATS:
                    transport = new NatsTransport_1.NatsTransport(process.env.NATS_URL);
                    break;
                case SupportedTransports.WEBSOCKET:
                    transport = new NatsTransport_1.NatsTransport(process.env.WEBSOCKET_URL);
                    break;
                default:
                    throw new Error('Unsupported transport');
            }
            yield transport.connect();
            return transport;
        });
    }
}
exports.Transport = Transport;
//# sourceMappingURL=Transport.js.map