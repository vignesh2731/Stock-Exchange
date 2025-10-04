import { TickerType } from "@/types/types"
import Link from "next/link"

const barDetails = ["Name","Price","24h Volume","Market Cap"]
export function MarketsPage({markets}:{markets:TickerType[]}){
    return(
        <div className="flex flex-col bg-slate-800 p-5 rounded-2xl w-[800px] gap-4">
            <div className="text-3xl font-bold">
                Top Markets Now
            </div>
            <div className="flex border-b border-slate-500 justify-between text-slate-400 p-2 text-sm">
                {barDetails.map((b,key)=>(
                    <div key={key}>
                        {b}
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-4 mt-3">
                {markets.map((market,key)=>(
                    <Link href={`/trade/${market.symbol}`} key={key}>
                        <div  className="flex justify-between hover:bg-slate-500 pt-3 rounded-2xl px-2 transition-colors duration-300 ease-in-out" key={key}>
                            <div className="flex gap-2 w-52 h-10">
                                <div className="">
                                    <img src="solana.png" alt="" className="rounded-full flex flex-col justify-center" />
                                </div>
                                <div>
                                    {market.symbol.split("_")[0]}
                                </div>
                            </div>
                            <div className="w-24 text-left">
                                {Number(market.lastPrice).toFixed(2)}
                            </div>
                            <div className="w-24 text-left">
                                {Number(market.volume).toFixed(2)}
                            </div>
                            <div className="w-24 text-left">
                                {Number(market.volume*market.lastPrice).toFixed(2)}
                            </div>
                        </div>      
                    </Link>
                ))}
            </div>
        </div>
    )
}