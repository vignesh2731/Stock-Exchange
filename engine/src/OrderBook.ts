import { RedisManager } from "./RedisManager";
import { Fills, Order, TradesType } from "./types/types";

export class OrderBook{
    asks: Order[]=[];
    bids: Order[]=[];
    baseAsset:string;
    quoteAsset:string;
    currentPrice:number;
    volume : number;
    trades: TradesType[]= [];
    constructor(baseAsset:string,quoteAsset:string,currentPrice?:number){
        this.asks = [];
        this.bids = [];
        this.baseAsset = baseAsset;
        this.quoteAsset = quoteAsset;
        this.currentPrice = (currentPrice) ? currentPrice : 0;
        this.trades = [];
        this.volume = 0;
    }

    postOrder(type:'bid' | 'ask', price :number, quantity: number, orderId:string, userId:string){
        if(type==='ask'){
            this.asks.push({price:price,quantity:quantity, orderId:orderId, userId:userId});
        }
        else{
            this.bids.push({price:price,quantity:quantity, orderId:orderId, userId:userId})
        }
        this.volume+=quantity;
    }

    matchBid(price: number,quantity: number,orderId:string,userId:string){
        let executedQty = 0;
        let fills:Fills[] = [];
        this.asks.sort((a,b)=>{
            return a.price-b.price;
        });
        for(let i = 0; i<this.asks.length; i++){
            if(price>=this.asks[i].price){
                this.currentPrice = this.asks[i].price;
                let broughtQty = Math.min(quantity,this.asks[i].quantity);
                this.asks[i].quantity-=broughtQty;
                this.volume-=broughtQty;
                executedQty+=broughtQty;
                quantity-=broughtQty
                fills.push({price:this.asks[i].price,quantity:broughtQty,orderId:this.asks[i].orderId})
                if(this.asks[i].quantity===0){
                    this.asks.splice(i,1);
                    i--;
                }
            }
        }
        if(executedQty>0){
            this.trades.push({price:price,quantity:executedQty,isBuyerMaker:true,timestamp:Date.now()})
            RedisManager.getInstance().publishToDBProcessor(JSON.stringify({price:price,timestamp:Date.now(),symbol:`${this.baseAsset}${this.quoteAsset}`}));
        }
        if(quantity>0){
            this.bids.push({price:price,quantity:quantity,userId:userId,orderId:orderId});
        }
        RedisManager.getInstance().publishToSocket(`depth.${this.baseAsset}${this.quoteAsset}`,JSON.stringify(this.getDepth()));
        RedisManager.getInstance().publishToSocket(`ticker.${this.baseAsset}${this.quoteAsset}`,JSON.stringify({data:this.getTicker(),type:'ticker'}));
        return {
            fills,
            executedQty
        }
    }

    matchAsk(price:number,quantity:number,orderId:string,userId:string){
        let executedQty = 0;
        let fills:Fills[] = [];
        this.bids.sort((a,b)=>{
            return a.price-b.price;
        });
        for(let i = 0; i<this.bids.length; i++){
            console.log(price,this.bids[i].price);
            if(price<=this.bids[i].price){
                this.currentPrice = this.bids[i].price;
                let broughtQty = Math.min(quantity,this.bids[i].quantity);
                this.bids[i].quantity-=broughtQty;
                this.volume-=broughtQty;
                executedQty+=broughtQty;
                fills.push({price:this.bids[i].price,quantity:broughtQty,orderId:orderId});
                quantity-=broughtQty
                if(this.bids[i].quantity===0){
                    this.bids.splice(i,1);
                    i--;
                }
            }
        }
        if(executedQty>0){
            this.trades.push({price:price,quantity:executedQty,isBuyerMaker:false,timestamp:Date.now()})
            RedisManager.getInstance().publishToDBProcessor(JSON.stringify({price:price,timestamp:Date.now(),symbol:`${this.baseAsset}${this.quoteAsset}`}));
        }
        if(quantity>0){
            this.asks.push({price:price,quantity:quantity,userId:userId,orderId:orderId});
        }
        RedisManager.getInstance().publishToSocket(`ticker.${this.baseAsset}${this.quoteAsset}`,JSON.stringify({data:this.getTicker(),type:'ticker'}));
        RedisManager.getInstance().publishToSocket(`depth.${this.baseAsset}${this.quoteAsset}`,JSON.stringify(this.getDepth()));
        return {
            fills,
            executedQty
        }
    }

    getTicker(){
        return {
            c:this.currentPrice,
            h: this.currentPrice,
            l:this.currentPrice,
            s: `${this.baseAsset}${this.quoteAsset}`,
            v: Math.abs(this.volume)
        }
    }

    getDepth(){
        let asks:[number,number][];
        let bids: [number,number][];

        this.asks.sort();
        this.bids.sort();

        asks = this.asks.map((ask)=>{
            return [ask.price,ask.quantity]
        })

        bids = this.bids.map((bid)=>{
            return [bid.price,bid.quantity]
        })
        return{
            asks,
            bids,
            type:"depth"
        }
    }

    getOpenOrders(userId:string){
        const openBids = this.bids.filter((bids)=>bids.userId===userId);
        const openAsks = this.asks.filter((asks)=>asks.userId===userId);
        return{
            openBids,
            openAsks
        }
    }

    deleteOrder(orderId:string){
        this.asks.splice(this.asks.findIndex(ask=>ask.orderId===orderId),1);
        this.bids.splice(this.bids.findIndex(bid=>bid.orderId===orderId),1);
        return{
            msg:"Order Deleted"
        }
    }

    getTrades(){
        return this.trades;
    }
}