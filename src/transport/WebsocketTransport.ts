import { ITransport } from './ITransport';


class WebsocketTransport implements ITransport {
    public readonly maxMessageSizeKB: number = 1024 * 1000;

    private readonly url: string;

    constructor(url: string) {
      this.url = url;
    }

    async connect(): Promise<void> {
    }


    async send(channel: string, message: Buffer): Promise<boolean> {
      return true;
    }

    async consume(channel: string, handler: Function): Promise<void> {

    }
}

export { WebsocketTransport };
