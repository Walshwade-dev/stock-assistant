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

        let report;
        try {
            report = await generateStockReport(stockData);
        } catch (err) {
            console.error("Report generation failed:", err.message);
            report = fallbackReport(stockData);
        }

        res.json({
            stocks: stockData,
            report
        });

    } catch (err) {
        console.error("Stock fetch failed:", err);
        res.status(500).json({ error: err.message });
    }
});




const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});

function fallbackReport(stocks) {
    return stocks.map(stock => {
        const direction =
            stock.monthChangePercent >= 0 ? "rose" : "declined";

        return `${stock.ticker} ${direction} ${Math.abs(
            stock.monthChangePercent
        )}% over the past month, trading between ${stock.monthLow} and ${stock.monthHigh}.`;
    }).join(" ");
}

