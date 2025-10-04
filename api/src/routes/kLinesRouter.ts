import { Router } from "express";
import { Client } from "pg";
export const kLinesRouter = Router();

const pgClient = new Client({
    connectionString: process.env.POSTGRES_URL
})
async function main(){
    await pgClient.connect();
}

main();

kLinesRouter.get("/", async (req, res) => {
    const { symbol, interval } = req.query;
    const viewName =
        interval === "1h"
            ? "price_1hr"
            : interval === "5m"
            ? "price_5m"
            : "price_1m";

    await pgClient.query(`REFRESH MATERIALIZED VIEW ${viewName}`);

    const query = `SELECT open, high, low, close, "end" 
                   FROM ${viewName} 
                   WHERE symbol = $1 
                   ORDER BY bucket ASC`;

    const response = await pgClient.query(query, [symbol]);
    res.json(response.rows);
});
