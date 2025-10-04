import { callbackType } from "@/types/types";

const BASE_URL = process.env.WEBSOCKET_URL!
export class SignallingManager{
    private static instance: SignallingManager;
    private ws : WebSocket
    private bufferedMessages:any = []
    private callbacks : callbackType = {};
    private initailised = false;
    private id:number;
    private constructor(){
        this.ws = new WebSocket(BASE_URL);
        this.bufferedMessages = [];
        this.callbacks = {};
        this.initailised = false;
        this.id = 1;
        this.init();
    }
    public static getInstance(){
        if(!this.instance){
            this.instance = new SignallingManager();
        }
        return this.instance;
    }
    init(){
        this.ws.onopen = ()=>{
            this.initailised = true;
            this.bufferedMessages.forEach((bf:any)=>{
                this.ws.send(JSON.stringify(bf));
            })
            this.bufferedMessages = []
        }
        this.ws.onmessage = (event)=>{

            const message = JSON.parse(event.data);

            const type = message.type;

            
            if(this.callbacks[type]){
                this.callbacks[type].forEach(({callback})=>{
                    if(type==="ticker"){
                        const newTicker = {
                            lastPrice: message.data.c,
                            high: message.data.h,
                            low: message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.V,
                            symbol: message.data.s,
                        }
                        callback(newTicker);
                    }
                    if(type==='depth'){
                        const updatedBids = message.bids, updatedAsks = message.asks;
                        callback({bids : updatedBids, asks: updatedAsks});
                    }
                })
            }

        }
    }
    sendMessage(message:{"method":string,"params":string[]}){
        const messageToSend = {
            ...message,
            id: this.id++
        }
        if(!this.initailised){
            this.bufferedMessages.push(messageToSend);
            return;
        }
        this.ws.send(JSON.stringify(messageToSend));
    }
    
    async registerCallback(type:string,callback:any,id:string){
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({callback,id});
    }

    async deRegisterCallback(type:string,id:string){
        if(this.callbacks[type]){
            this.callbacks[type].splice(this.callbacks[type].findIndex((callback:any)=>callback.id===id),1);
        }
    }

}