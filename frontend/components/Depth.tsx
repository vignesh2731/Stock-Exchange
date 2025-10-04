"use client"
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { getDepth, getTrades } from "@/app/utils/httpClient";
import { SignallingManager } from "@/app/utils/SignallingManager";

export function Depth({market}:{market:string}){
const [bids,setBids] = useState<any[]>([]);
const [asks,setAsks] = useState<any[]>([]);
const [price,setPrice] = useState<number | null>(null);
    useEffect(()=>{
        getDepth(market).then((data)=>{
            const sortedBids = [...data.bids].sort((a, b) => Number(b[0]) - Number(a[0])).slice(0, 5);
            const sortedAsks = [...data.asks].sort((a, b) => Number(a[0]) - Number(b[0])).slice(0, 5);
            sortedBids.reverse();
            let cumBid = 0, cumAsk = 0;
            const bidsWithCum = sortedBids.map(([price, qty]) => {
                cumBid += Number(qty);
                return [price, qty, cumBid.toFixed(2)];
            });

            const asksWithCum = sortedAsks.map((a)=>{
                cumAsk+=Number(a[1]);
                return [a[0],a[1],cumAsk.toFixed(2)]
            })
            setBids(bidsWithCum);
            setAsks(asksWithCum);
        })
        SignallingManager.getInstance().registerCallback('depth',(data:any)=>{
            const sortedBids = [...data.bids].sort((a, b) => Number(b[0]) - Number(a[0])).slice(0, 5);
            const sortedAsks = [...data.asks].sort((a, b) => Number(a[0]) - Number(b[0])).slice(0, 5);
            sortedBids.reverse();
            let cumBid = 0, cumAsk = 0;
            const bidsWithCum = sortedBids.map(([price, qty]) => {
                cumBid += Number(qty);
                return [price, qty, cumBid.toFixed(2)];
            });

            const asksWithCum = sortedAsks.map((a)=>{
                cumAsk+=Number(a[1]);
                return [a[0],a[1],cumAsk.toFixed(2)]
            })
            setBids(bidsWithCum);
            setAsks(asksWithCum);
        },`DEPTH-${market}`)

        SignallingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth.${market}`]});

        return ()=>{
            SignallingManager.getInstance().deRegisterCallback('depth',`DEPTH-${market}`);
            SignallingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth.${market}`]});
        }
    },[])
    return(
        <div className="flex flex-col p-5 gap-3 border border-slate-800 rounded-4xl w-[320px]">
            <div className="flex gap-15 text-sm">
                <div>   
                    {"Price (USD)"}
                </div>
                <div className="text-slate-500">
                    {"Size (SOL)"}
                </div>
                <div className="text-slate-500">
                    {"Total (SOL)"}
                </div>
            </div>
            <div className="flex flex-col-reverse gap-2 cursor-pointer">

                {asks.map((a,key)=>(
                    <div className="w-full flex justify-between" key={key}>
                        <div className="text-red-500 w-24">{a[0]}</div>
                        <div className="w-16">{a[1]}</div>
                        <div className="w-16">{a[2]}</div>
                    </div>
                ))}
            </div>
            <div className="text-2xl text-green-400">
                {price!= null && price}
            </div>
            <div className="flex flex-col gap-2 cursor-pointer">
                {bids.map((a,key)=>(
                    <div className="flex w-full justify-between " key={key}>
                        <div className="text-green-400 w-16">{a[0]}</div>
                        <div className="w-16">{a[1]}</div>
                        <div className="w-16">{a[2]}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}