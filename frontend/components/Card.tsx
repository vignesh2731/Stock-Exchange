"use client"

interface CardProps{
    label:string,
    list:any
}

export function Card({label,list}: CardProps){
    return(
        <div className="bg-slate-900 flex flex-col rounded-md w-[400px] py-3 font-medium">
            <div className="flex flex-col justify-center pb-2 pl-5">
                {label}
            </div>
            <div className="flex flex-col">
                {list.map((l:any,key:any)=>(
                    <div className="flex justify-between gap-10 hover:bg-slate-700 py-2" key={key}>
                        <div className="flex gap-2 pl-5 w-52 justify-start">
                            <div>
                                <img src={'solana.png'} alt="" className="rounded-full" />
                            </div>
                            <div>
                                {(l.symbol.split('_')[0])}
                            </div>
                        </div>
                        <div>
                            {l.lastPrice}
                        </div>
                        <div className={`pr-5 ${l.priceChangePercent>0?'text-green-500':'text-red-400'}`}>
                            {Number(l.volume).toPrecision(2)} 
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}