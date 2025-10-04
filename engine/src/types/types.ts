export interface Order{
    price: number;
    quantity:number,
    orderId:string;
    userId:string
}

export interface Balances{
    [userId:string]:{
        balance: number,
        locked: number
    }
}

export interface Fills{
    price:number,
    quantity:number,
    orderId:string,
}

export interface TradesType{
    price: number,
    quantity: number,
    timestamp: any,
    isBuyerMaker: boolean
}