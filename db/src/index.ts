import { Client } from "pg";
import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config({path:'../.env'});

const pgClient = new Client({
    connectionString: process.env.POSTGRES_URL
});
const redisClient = createClient({url:process.env.REDIS_URL});



async function main(){
    await redisClient.connect()
    await pgClient.connect();
    console.log("Connected");
    while(1){
        const response = await redisClient.brPop('dbProcessor',1);
        if(response){
            const data = JSON.parse(response.element);
            const { price, timestamp, symbol } = data;
            const query = `INSERT INTO stock_prices (time,price,symbol) VALUES($1,$2,$3)`;
            const values = [new Date(timestamp).toISOString(),price,symbol];
            await pgClient.query(query,values);
        }
    }
}

main();