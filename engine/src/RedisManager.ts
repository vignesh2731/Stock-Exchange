import { createClient , RedisClientType } from 'redis'


export class RedisManager{
    private static instance: RedisManager;
    private publisher: RedisClientType;

    private constructor(){
        this.publisher = createClient();
        this.publisher.connect();
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    async publishMessageToSubscribe(clientId:string,message:any){
        await this.publisher.publish(clientId,JSON.stringify(message));
    }

    async publishToSocket(channel:string,message:string){
        await this.publisher.publish(channel,message);
    }

    async publishToDBProcessor(message:string){
        await this.publisher.lPush('dbProcessor',message);
    }
}