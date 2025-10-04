import { OrderBook } from "./OrderBook";
import { RedisManager } from "./RedisManager";
import { Balances } from "./types/types";

export class Engine{
    private orderBook : OrderBook[];
    private balances : Balances;
    constructor(){
        this.orderBook = [
            new OrderBook('ITC', "_INR", 0),
            new OrderBook('RELIANCE', "_INR", 0),
            new OrderBook('TCS', "_INR", 0),
            new OrderBook('ADANI', "_INR", 0),
            new OrderBook('INFOSYS', "_INR", 0),
            new OrderBook('HDFCBANK', "_INR", 0),
            new OrderBook('ICICIBANK', "_INR", 0),
            new OrderBook('SBIN', "_INR", 0),
            new OrderBook('AXISBANK', "_INR", 0),
            new OrderBook('KOTAKBANK', "_INR", 0),
            new OrderBook('LT', "_INR", 0),
            new OrderBook('WIPRO', "_INR", 0),
            new OrderBook('HINDUNILVR', "_INR", 0),
            new OrderBook('BAJFINANCE', "_INR", 0),
            new OrderBook('BHARTIARTL', "_INR", 0),
            new OrderBook('ULTRACEMCO', "_INR", 0),
            new OrderBook('MARUTI', "_INR", 0),
            new OrderBook('SUNPHARMA', "_INR", 0),
            new OrderBook('TITAN', "_INR", 0),
            new OrderBook('ONGC', "_INR", 0),
            new OrderBook('NTPC', "_INR", 0),
            new OrderBook('POWERGRID', "_INR", 0),
            new OrderBook('ASIANPAINT', "_INR", 0),
            new OrderBook('JSWSTEEL', "_INR", 0),
            new OrderBook('TATASTEEL', "_INR", 0),
            new OrderBook('BAJAJ-AUTO', "_INR", 0),
            new OrderBook('HEROMOTOCO', "_INR", 0),
            new OrderBook('EICHERMOT', "_INR", 0),
            new OrderBook('HCLTECH', "_INR", 0),
            new OrderBook('GRASIM', "_INR", 0)
        ];

        this.balances = {};
    }
    handleMessage(id:string,message:any){
        const market = message.data?.market || "";
        const clientId = id;
        console.log(message.type);
        if(message.type==="GET_AVAILABLE_TICKERS"){
            const response = this.orderBook.map(od=>{
                const tickerData = od.getTicker();
                return {
                    lastPrice: tickerData.c,
                    high: tickerData.h,
                    low: tickerData.l,
                    symbol: tickerData.s,
                    volume: tickerData.v
                }
            });
            console.log(response);
            RedisManager.getInstance().publishMessageToSubscribe(clientId,response);
            return;
        }
        const requiredMarket = this.orderBook.find((o)=>(o.baseAsset+o.quoteAsset)===market);
        if(!requiredMarket){
            const assests = market.split('_');
            this.orderBook.push(new OrderBook(assests[0],`_${assests[1]}`));
        }
        if(message.type==="CREATE_ORDER"){
            const orderId = String(Math.random()*10000)
            const {price,quantity,side,userId} = message.data;
            console.log(price,quantity,side,userId);
            if(side==='buy'){
                const response = requiredMarket?.matchBid(Number(price),Number(quantity),String(orderId),String(userId));
                console.log(response);
                console.log(typeof response);
                RedisManager.getInstance().publishMessageToSubscribe(clientId,response);
            }
            if(side==='sell'){
                console.log("In sell");
                const response = requiredMarket?.matchAsk(price,quantity,orderId,userId);
                RedisManager.getInstance().publishMessageToSubscribe(clientId,response);
            }
        }
        
        else if(message.type==="DELETE_ORDER"){
            const orderId = message.message.data.orderId;
            const response = requiredMarket?.deleteOrder(orderId);
            RedisManager.getInstance().publishMessageToSubscribe(clientId,response);

        }
        else if(message.type==="GET_OPEN_ORDERS"){
            const userId = message.message.data.userId;
            const response = requiredMarket?.getOpenOrders(userId);
            RedisManager.getInstance().publishMessageToSubscribe(clientId,response);
        }

        else if(message.type==="GET_TRADES"){
            const requiredOrderBook = this.orderBook.find((o)=>(`${o.baseAsset}${o.quoteAsset}`)===market);
            if(!requiredOrderBook){
                throw new Error('Market doesnt exists');
            }
            const response = requiredOrderBook.getTrades();
            console.log(response);
            RedisManager.getInstance().publishMessageToSubscribe(clientId,response);
        }

        else if(message.type==="GET_DEPTH"){
            this.orderBook.forEach(o=>{
                console.log(o.baseAsset+o.quoteAsset);
            })
            const requiredOrderBook = this.orderBook.find((o)=>(`${o.baseAsset}${o.quoteAsset}`)===market);
            try{
                 if(!requiredOrderBook){
                    throw new Error('Market doesnt exists');
                }
            }catch(err){
                return {
                    msg:"Orderbook doesnt exists"
                }
            }
           

            const response = requiredOrderBook.getDepth();
            RedisManager.getInstance().publishMessageToSubscribe(clientId,response);
        }

        
    }
}