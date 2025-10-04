"use client"
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./Button";

export function NavBar(){
    const route = usePathname();
    const router = useRouter();
    return(
        <div className=" border-b border-slate-800">
            <div className="flex justify-between items-center p-4">
                <div className="flex">
                    <div className={`pl-4 text-xl flex flex-col justify-center  text-white cursor-pointer`} onClick={()=>router.push("/")}>
                        Exchange
                    </div>
                    <div className={`pl-8 text-sm flex flex-col justify-center font-semibold cursor-pointer ${route.startsWith('/markets') ? 'text-white': 'text-slate-500'}`} onClick={()=>router.push("/markets")}>
                        Markets
                    </div>
                    <div className={`pl-8 text-sm flex flex-col justify-center font-semibold cursor-pointer ${route.startsWith('/trade') ? 'text-white': 'text-slate-500'}`} onClick={()=>router.push("/trade/ITC_INR")}>
                        Trade
                    </div>
                </div>
                <div className="flex gap-10 mr-2">
                        <Button label="Deposit" onClickAction={()=>{}} className="border-green-500 text-green-600 bg-green-200 hover:bg-green-300 " />
                        <Button label="Withdraw" onClickAction={()=>{}} className="border-blue-500 text-blue-600 bg-blue-200 hover:bg-blue-300 " />
                </div>
            </div>
        </div>
    )
}