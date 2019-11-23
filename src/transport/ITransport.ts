export interface ITransport {
    maxMessageSizeKB: number;
    connect(): Promise<void>;
    send(channel: string, message: Buffer): Promise<boolean>;
    consume(channel: string, handler: Function): Promise<void>;
}
