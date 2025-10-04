import { MarketsPage } from "@/components/MarketsPage";
import { getTickers, getTop5Markets } from "@/app/utils/httpClient";

export default async function Market(){
    const response = await getTickers();
    return(
        <div className="w-screen flex flex-col mt-20">
            <div className="mx-auto my-auto">
                <MarketsPage markets={response} />
            </div>
        </div>
    )
}