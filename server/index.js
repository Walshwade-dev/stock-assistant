import express from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

import { fetchMassiveData } from "./services/massive.js";
import { generateStockReport } from "./services/openai.js";

const app = express();

app.use(cors());              // allow frontend to talk to server
app.use(express.json());

app.post("/api/stocks", async (req, res) => {
    const { tickers } = req.body;

    if (!Array.isArray(tickers) || tickers.length === 0 || tickers.length > 3) {
        return res.status(400).json({
            error: "Provide between 1 and 3 tickers"
        });
    }

    try {
        const stockData = await fetchMassiveData(tickers);
        const report = await generateStockReport(stockData);
        
        res.json({
            stocks: stockData,
            report
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});




app.listen(3000, () => {
    console.log("API server running on http://localhost:3000");
});
