import { createClient, RedisClientType } from "redis";
import dotenv from 'dotenv'
dotenv.config({path:"../.env"});
const redisUrl = process.env.REDIS_URL;
export class RedisManager {
  private static instance: RedisManager;
  private client: ReturnType<typeof createClient>;
  private publisher: RedisClientType;

  private constructor() {
    this.client = createClient({url:redisUrl});
    this.publisher = createClient({url:redisUrl});

    this.client.connect().then(() => {
      console.log("Connected");
    });

    this.publisher.connect().then(() => {
      console.log("Connected");
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  sendAndAwait(message: any) {
    return new Promise<any>(async (resolve) => {
      const clientId = this.generateClientId();

      await this.client.subscribe(clientId, (message) => {
        this.client.unsubscribe(clientId);
        resolve(message);
      });

      await this.publisher.lPush(
        "messages",
        JSON.stringify({ id: clientId, message })
      );
    });
  }

  generateClientId() {
    return String(Math.random() * 100000);
  }
}
