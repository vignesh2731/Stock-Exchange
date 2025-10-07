"use client"
import Link from "next/link";
import { Button } from "./Button";

export function LandingImage(){
    return(
        <div className="relative w-full flex justify-center border-slate-500 border-4 rounded-xl">
            <div>
                <img src="landing-logo.webp" alt="" className="flex justify-center w-[1200px] h-[300px]"  />
                <div className="absolute left-5 font-semibold top-20 flex flex-col gap-5">
                    <div className="text-3xl ">
                        Earn 4.70% APY on your SOL collateral
                    </div>
                    <div>
                        Lend SOL to earn staking yield + lending yield, and use as collateral.
                    </div>
                    <Link href={"/trade/ITC_INR"}>
                        <Button label="Trade Now" className="bg-white flex flex-col justify-center items-center text-black hover:bg-slate-500" onClickAction={()=>{}}/>
                    </Link>
                </div>
            </div>
        </div>
    )
}