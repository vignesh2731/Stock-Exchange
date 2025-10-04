"use client"
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Trades } from "./Trades";
import { Depth } from "./Depth";

export function DepthAndTrades({market}:{market:string}){
    const [option,setOption] = useState("Book");
    return(
        <div className="flex flex-col p-5 gap-3 border border-slate-800 rounded-4xl">
            <div className="flex text-md gap-1">
                <Button label="Book" onClickAction={()=>setOption('Book')} className={` border-slate-800 hover:bg-slate-500 ${option==="Book" ? 'bg-slate-800':'bg-black'}`}/>
                <Button label="Trades" onClickAction={()=>{setOption('Trades')}} className={` border-slate-800 hover:bg-slate-500 ${option==="Trades" ? 'bg-slate-800':'bg-black'}`}/>
            </div>
            {option==='Book' && <Depth market={market}/>}
            {option==='Trades' && <Trades market={market} />}
        </div>
    )
}