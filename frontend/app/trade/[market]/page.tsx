"use client"
import { BuySell } from "@/components/BuySellUI";
import { Chart } from "@/components/Chart";
import { DepthAndTrades } from "@/components/Depth-Trades";
import { MarketBar } from "@/components/MarketBar";
import { useParams } from "next/navigation"
import { useEffect, useRef } from "react";

export default function Trade({params}:{params:string}){
    const {market} = useParams();
    const ref = useRef<HTMLElement | null>(null);
    useEffect(()=>{

    },[])
    return(
        <div className="flex flex-1 relative">
            <div className="flex flex-col flex-1">
                <MarketBar market={String(market) || " "}/>
                <div className="flex">
                    <div className="flex flex-1 justify-center items-center">
                        <Chart market={market as string}/>
                    </div>
                    <div>
                        <DepthAndTrades market={market as string}/>
                    </div>
                </div>
            </div>
            <div>
                <BuySell market={market as string} />
            </div>
        </div>
    )
}