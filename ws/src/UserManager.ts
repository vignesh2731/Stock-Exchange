import { createClient, RedisClientType } from 'redis'
import { WebSocket } from 'ws';

export class UserManager{
    private userMap = new Map<string,WebSocket>();
    private subscriptions = new Map<string,string[]>;
    private reverseSubscriptions = new Map<string,string[]>;
    private static  instance : UserManager;
    private redisClient : RedisClientType;

    private constructor(){
        this.redisClient = createClient({url:process.env.REDIS_URL});
        this.redisClient.connect();
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new UserManager();
        }
        return this.instance;
    }

    addUser(ws:WebSocket){
        const userId = this.generateRandomId();
        this.userMap.set(userId,ws);
        this.addListeners(ws,userId);
    }

    generateRandomId(){
        return String(Math.random()*10000);
    }

    addListeners(ws:WebSocket,userId:string){
        ws.on('message',(message)=>{
            const parsedMessage = JSON.parse(String(message));
            if(parsedMessage.method==='SUBSCRIBE'){
                parsedMessage.params.forEach((p:string)=>{
                    this.subscriptions.set(userId,[...(this.subscriptions.get(userId)|| []),(p)]);
                    this.reverseSubscriptions.set(p,[...(this.reverseSubscriptions.get(p)||[]),userId]);
                    if(this.reverseSubscriptions.get(p)?.length===1){
                        this.redisClient.subscribe(p,(message:string,channel:string)=>{
                            this.reverseSubscriptions.get(channel)?.forEach((sub)=>{
                                const client = this.userMap.get(sub);
                                if(client && client.readyState===WebSocket.OPEN){
                                    client.send(message);
                                }
                            })
                        })
                    }
                })
                
            }
            else if(parsedMessage.method==='UNSUBSCRIBE'){
                parsedMessage.params.forEach((p:string)=>{
                    this.subscriptions.set(userId,(this.subscriptions.get(userId) || []).filter(subs=>subs!==p));
                    this.reverseSubscriptions.set(p,(this.reverseSubscriptions.get(p) || []).filter((ids)=>ids!=userId));
                    if(this.reverseSubscriptions.get(p)?.length==0){
                        this.redisClient.unsubscribe(p);
                        this.reverseSubscriptions.delete(p);
                    }
                })
            }
        })

        ws.on('close',()=>{
            this.userMap.delete(userId);
            this.subscriptions.delete(userId);
        })
    }

}