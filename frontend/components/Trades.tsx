"use client"

import { TradeType } from "@/types/types";
import { getTrades } from "@/app/utils/httpClient";
import { SignallingManager } from "@/app/utils/SignallingManager";
import { useEffect, useState } from "react"

export function Trades({market}:{market:string}){
    const [trades,setTrades] = useState<TradeType[] | []>([]);
    useEffect(()=>{
        getTrades(market).then((data)=>{
            const realTrades = data.slice(0,10);
            setTrades(realTrades);
        })

        SignallingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`trade.${market}`]});
        SignallingManager.getInstance().registerCallback('trade',(data:any)=>{
            const latestTrade = {
                price:data.p,
                quantity: data.q,
                timestamp: Math.floor(data.T/1000),
                isBuyerMaker: data.m
            }
            setTrades((prev : any)=>{
                const updated = [...prev,latestTrade];
                return updated.slice(0,10);
            })
            },`TRADE-${market}`)

        return ()=>{
            SignallingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`trade.${market}`]});
            SignallingManager.getInstance().deRegisterCallback('trade',`TRADE-${market}`);
        }
    },[])
   function timestampToTime(ms: number): string {
        const date = new Date(ms);
        const hh = date.getHours().toString().padStart(2, "0");
        const mm = date.getMinutes().toString().padStart(2, "0");
        const ss = date.getSeconds().toString().padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    }

    return(
        <div className="flex flex-col p-5 gap-3 border border-slate-800 rounded-4xl w-[320]">
            <div className="flex gap-15 text-sm text-slate-400">
                <div>
                    {"Price (USD)"}
                </div>
                <div>
                    {"Oty (SOL)"}
                </div>
                <div>
                    {"Time"}
                </div>
            </div>
            <div className="flex flex-col gap-3 font-medium">
                {trades.map((t,key)=>(
                    <div className="flex justify-between" key={key}>
                        <div className={`${t.isBuyerMaker? 'text-red-400': 'text-green-300'} w-24`}>
                            {t.price}
                        </div>
                        <div className="text-white">
                            {Number(t.quantity).toPrecision(2)}
                        </div>
                        <div className="text-slate-500">
                            {timestampToTime(t.timestamp)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}