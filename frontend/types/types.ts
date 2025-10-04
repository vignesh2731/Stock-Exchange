export interface TickerType{
    symbol:string,
    lastPrice:string,
    high:string,
    low:string,
    volume:string,
}

export type TickersType = TickerType[];


export interface DepthType{
    asks: [string,string][],
    bids: [string,string][],
    lastUpdate: string,
    timestamp: number
}

export interface TradeType{
    id: number,
    price: string,
    quantity:string,
    quoteQuantity:string,
    timestamp:number,
    isBuyerMaker:boolean
}

export interface kLinesType{
    start?: string,
    end: string,
    open:string,
    high:string,
    low:string,
    close:string,
    volume?:string,
    quoteVolume?:string,
    trades?:string
}

export interface callbackType{
    [type:string]:{callback:(data:any)=>void,id:string}[]
}