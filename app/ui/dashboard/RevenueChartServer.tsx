import RevenueChartClient from "./RevenueChartClient";
import { fetchRevenue } from "@/app/lib/data";

export default async function RevenueChartServer() {
  const revenue = await fetchRevenue();
  return <RevenueChartClient revenue={revenue} />;
}
