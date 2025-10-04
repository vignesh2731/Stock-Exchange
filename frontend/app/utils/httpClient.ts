"use server"
import { DepthType, kLinesType, TickersType, TickerType, TradeType } from '@/types/types';
import axios from 'axios'

const BASE_URL = process.env.BACKEND_URL

export async function getTickers():Promise<TickersType>{
    try{
        const response = await axios(`${BASE_URL}/tickers`);
        const data = JSON.parse(response.data);
        return data;
    }catch(err){
        console.error;
        return [];
    }
    
}

export async function getTicker(market:string){
    const tickers = await getTickers();

    const ticker : TickerType | null = tickers.find((t)=>t.symbol===market) || null;
    if(!ticker){
        throw new Error(`Market doesnt exists`);
    }
    return ticker;
}

export async function getDepth(symbol:string):Promise<DepthType>{
    const response = await axios.get(`${BASE_URL}/depth`,{
        params:{
            symbol:symbol
        }
    })
    return response.data;
}

export async function getTrades(symbol:string):Promise<TradeType[]>{
    const response = await axios.get(`${BASE_URL}/trades`,{
        params:{
            symbol:symbol
        }
    })
    return response.data;
}

export async function getKLines(market:string,interval:string,startTime?:number,endTime?:number):Promise<kLinesType[]>{
    const response = await axios.get(`${BASE_URL}/klines`,{
        params:{
            symbol:market,
            interval:interval,
            startTime:startTime,
            endTime:endTime
        }
    })
    const data : kLinesType[] = response.data;
    return data?.sort((x,y)=>(Number(x.end)<Number(y.end)? -1 : 1));
}

export async function getMarkets(){
    const response = await axios.get(`${BASE_URL}/markets`);
    return response.data;
}

export async function getTop5Markets(){
    const topMarkets = [];
    topMarkets.push(getTicker('TATA_INR'));
    topMarkets.push(getTicker('RELIANCE_INR'));
    topMarkets.push(getTicker('ADANI_INR'));
    topMarkets.push(getTicker('ITC_INR'));
    topMarkets.push(getTicker('TCS_INR'));
    const response = await Promise.all(topMarkets)
    return response;
}

export async function placeOrder(price:string,quantity:string,side:'buy'|'sell',userId:string,market:string){
     const response = await axios.post(`${BASE_URL}/orders`,{
        price:price,
        quantity:quantity,
        side:side,
        userId,
        market
    })
    return JSON.parse(response.data as string);
}