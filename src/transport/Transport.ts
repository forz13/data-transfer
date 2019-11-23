import { NatsTransport } from './NatsTransport';
import { ITransport } from './ITransport';

enum SupportedTransports {
    NATS = 'nats',
    WEBSOCKET='websocket'
}

class Transport {
  public static async getInstance(transportType: string): Promise<ITransport> {
    let transport;
    switch (transportType) {
      case SupportedTransports.NATS:
        transport = new NatsTransport(process.env.NATS_URL);
        break;
      case SupportedTransports.WEBSOCKET:
        transport = new NatsTransport(process.env.WEBSOCKET_URL);
        break;
      default:
        throw new Error('Unsupported transport');
    }
    await transport.connect();
    return transport;
  }
}

export { Transport, SupportedTransports };
