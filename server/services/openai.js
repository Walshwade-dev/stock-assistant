import OpenAI from "openai";

export async function generateStockReport(stockSummary) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        // graceful fallback if no OpenAI key
        return generateRuleBasedReport(stockSummary);
    }

    const client = new OpenAI({ apiKey });

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a trading guru. Given data on share prices over the past 30 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell."
                },
                {
                    role: "user",
                    content: `
                    ${JSON.stringify(stockSummary, null, 2)}
                    `
                }
            ],
            temperature:1.1
        });
 
        return response.choices[0].message.content;

    } catch (err) {
        if (err.status === 429) {
            return generateFallbackReport(stockSummary);
        }
        throw err;
    }
}

function generateRuleBasedReport(stock) {
  const trend =
    stock.monthChangePercent > 0 ? "upward" : "downward";

  return `${stock.ticker} showed a ${trend} trend over the past month,
moving ${Math.abs(stock.monthChangePercent)}%.
Price action stayed between ${stock.monthLow} and ${stock.monthHigh},
suggesting moderate volatility.`;
}

