"use client"

import { getTicker } from "@/app/utils/httpClient"
import { SignallingManager } from "@/app/utils/SignallingManager";
import { useEffect, useState } from "react"

export function MarketBar({market}:{market:string}){
    const [ticker,setTicker] = useState<any>();
    useEffect(()=>{
        getTicker(market).then((data)=>{
            setTicker(data);
        })
        SignallingManager.getInstance().registerCallback("ticker",(data:any)=>{
            setTicker(data);
        },`TICKER-${market}`)
        SignallingManager.getInstance().sendMessage({'method':"SUBSCRIBE","params":[`ticker.${market}`]});

        return ()=>{
            SignallingManager.getInstance().deRegisterCallback("ticker",`TICKER-${market}`);
            SignallingManager.getInstance().sendMessage({'method':"UNSUBSCRIBE","params":[`ticker.${market}`]});
        }
    },[market])
    return (
        <div className="p-10 flex border border-slate-800 items-center text-white gap-10">
            <div className="flex gap-2 font-bold">
                <div className="flex flex-col justify-center">
                    <img src="/solana.png"/>
                </div>
                <p>{market}</p>
            </div>
            <div className="font-semibold">
                <p>
                    {ticker?.lastPrice}
                </p>
                <p>
                    ${ticker?.lastPrice}
                </p>
            </div>
            {/* <div>
                <div className="text-slate-500">
                    24H Change
                </div>
                <div className={`text-green-500 font-semibold ${Number(ticker?.priceChange) > 0 ? "text-green-500" : "text-red-500"}`}>
                    {Number(ticker?.priceChange) > 0 ? "+" : ""} {ticker?.priceChange} {Number(ticker?.priceChangePercent)?.toFixed(2)} %
                </div>
            </div> */}
            <div>
                <div className="text-slate-500">
                    24H High
                </div>
                <div className="font-semibold">
                    {ticker?.high}
                </div>
            </div>
            <div>
                <div className="text-slate-500">
                    24H Low
                </div>
                <div className="font-semibold">
                    {ticker?.low}
                </div>
            </div>
            <div>
                <div className="text-slate-500">
                    24H Volume{" (USDC)"}
                </div>
                <div className="text-green-500">
                    {ticker?.volume}
                </div>
            </div>

        </div>
    )
}

