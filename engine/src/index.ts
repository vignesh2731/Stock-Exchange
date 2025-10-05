import { createClient } from "redis";
import { Engine } from "./Engine";

async function main(){
    const engine = new Engine();
    const redisClient = createClient({url:process.env.REDIS_URL});
    await redisClient.connect();
    while(1){
        const response = await redisClient.brPop('messages',1);
        if(!response)continue;
        const data = JSON.parse(response?.element!);
        engine.handleMessage(data.id,data.message); 
    }
}

main();