import { NatsTransport } from './NatsTransport';
import { ITransport } from './ITransport';

enum SupportedTransports {
    NATS = 'nats',
    WEBSOCKET='websocket'
}

class Transport {
  public static async getInstance(transportType: string) {
    let transport;
    switch (transportType) {
      case SupportedTransports.NATS:
        transport = new NatsTransport(process.env.NATS_URL);
        break;
      case SupportedTransports.WEBSOCKET:
        throw new Error('Transport not yet supported');
      default:
        throw new Error('Unsupported transport');
    }
    await transport.connect();
    return transport;
  }
}

export { Transport, SupportedTransports };
