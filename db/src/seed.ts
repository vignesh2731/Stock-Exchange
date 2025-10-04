import { Client } from "pg";
import dotenv from 'dotenv'
dotenv.config({path:'../.env'});

const client = new Client({
    connectionString: process.env.POSTGRES_URL
})
async function main(){
    await client.connect();
    await client.query(`
        CREATE TABLE IF NOT EXISTS stock_prices(
            time TIMESTAMPTZ NOT NULL,
            symbol VARCHAR(10) NOT NULL,
            price DOUBLE PRECISION
        );
    `)
    const res = await client.query(`
        SELECT 1 
        FROM timescaledb_information.hypertables 
        WHERE hypertable_name = 'stock_prices';
    `);

    if (res.rowCount === 0) {
        await client.query(`
            SELECT create_hypertable('stock_prices', 'time', 'symbol', 2);
        `);
        console.log("Hypertable created!");
    } else {
        console.log("Hypertable already exists.");
    }
    await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS price_1m AS
        SELECT
            time_bucket('1 minute', time) AS bucket,
            first(price, time) AS open,
            MAX(price) AS high,
            MIN(price) AS low,
            last(price, time) AS close,
            MIN(time) AS start,
            MAX(time) AS "end",
            symbol
        FROM stock_prices
        GROUP BY bucket, symbol
        ORDER BY bucket;
        `)
    await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS price_5m AS
        SELECT
            time_bucket('5 minutes', time) AS bucket,
            first(price, time) AS open,
            MAX(price) AS high,
            MIN(price) AS low,
            last(price, time) AS close,
            MIN(time) AS start,
            MAX(time) AS "end",
            symbol
        FROM stock_prices
        GROUP BY bucket, symbol
        ORDER BY bucket;
        `)
    await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS price_1hr AS
        SELECT
            time_bucket('1 hour', time) AS bucket,
            first(price, time) AS open,
            MAX(price) AS high,
            MIN(price) AS low,
            last(price, time) AS close,
            MIN(time) AS start,
            MAX(time) AS "end",
            symbol
        FROM stock_prices
        GROUP BY bucket, symbol
        ORDER BY bucket;
        `)
    refreshViews();
}

function refreshViews(){
    setInterval(async()=>{
        await client.query(`REFRESH MATERIALIZED VIEW price_1m;`);
        await client.query(`REFRESH MATERIALIZED VIEW price_5m;`);
        await client.query(`REFRESH MATERIALIZED VIEW price_1hr;`);
    },10000)
}

main();