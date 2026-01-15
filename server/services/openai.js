import OpenAI from "openai";

export async function generateStockReport(stockSummary) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        // graceful fallback if no OpenAI key
        return generateFallbackReport(stockSummary);
    }

    const client = new OpenAI({ apiKey });

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: "You generate concise financial summaries."
                },
                {
                    role: "user",
                    content: `
Summarize the following 1-month stock performance briefly.
${JSON.stringify(stockSummary, null, 2)}
`
                }
            ],
            temperature: 0.4
        });

        return response.choices[0].message.content;

    } catch (err) {
        if (err.status === 429) {
            return generateFallbackReport(stockSummary);
        }
        throw err;
    }
}

function generateFallbackReport(stocks) {
    return stocks.map(stock => {
        const direction =
            stock.monthChangePercent >= 0 ? "gained" : "declined";

        return `${stock.ticker} ${direction} ${Math.abs(
            stock.monthChangePercent
        )}% over the past month, trading between ${stock.monthLow} and ${stock.monthHigh}.`;
    }).join(" ");
}
