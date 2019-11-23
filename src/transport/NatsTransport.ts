import { connect, Payload, Client } from 'ts-nats';
import { EventEmitter } from 'events';
import { ITransport } from './ITransport';

class NatsTransport extends EventEmitter implements ITransport {
    public readonly maxMessageSizeKB: number = 1024 * 1000;

    public readonly timeoutMS: number = 5000;

    private readonly url: string;

    private client: Client;

    constructor(url: string) {
      super();
      this.url = url;
    }

    async connect(): Promise<void> {
      this.client = await connect({ servers: [this.url], payload: Payload.BINARY });
    }

    async send(channel: string, message: Buffer): Promise<boolean> {
      try {
        await this.client.request(channel, this.timeoutMS, message);
        return true;
      } catch (err) {
        throw new Error(`NatsTransport->send->error: ${err.message}`);
      }
    }

    async consume(channel: string, handler: Function): Promise<void> {
      await this.client.subscribe(channel, async (err, msg) => {
        if (err) {
          return;
        }
        if (msg.reply) {
          const isLastData = msg.size === 0;
          await handler(msg.data, isLastData);
          this.client.publish(msg.reply, '');
        }
      });
    }
}

export { NatsTransport };
