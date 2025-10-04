import { Card } from "@/components/Card";
import { LandingImage } from "@/components/Landing";
import { getTickers } from "@/app/utils/httpClient";

export default async function Home() {
  const markets= await getTickers();
  console.log("GOOOAT")
  const list1 = markets.slice(0,5);
  const list2 = markets.slice(5,10);
  const list3 = markets.slice(15,20);
  return (
    <div className="min-h-screen flex flex-col justify-center w-screen ">
      <div className="mx-auto flex flex-col gap-10">
        <div>
          <LandingImage/>
        </div>
        <div className="flex justify-between">
            <Card label="New" list={list1} />
            <Card label="Top Gainers" list={list2} />
            <Card label="Popular" list={list3} />   
        </div>
      </div>
    </div>
  );
}
