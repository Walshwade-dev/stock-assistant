import fetch from "node-fetch";

export async function fetchMassiveData(tickers) {
    const API_KEY = process.env.MASSIVE_API_KEY;
    if (!API_KEY) throw new Error("MASSIVE_API_KEY not set");

    const { from, to } = getLastMonthRange();
    const results = [];

    for (const ticker of tickers) {
        const url =
            `https://api.massive.com/v2/aggs/ticker/${ticker}` +
            `/range/1/day/${from}/${to}` +
            `?adjusted=true&apiKey=${API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok || !data.results || data.results.length < 2) continue;

        const first = data.results[0];
        const last = data.results.at(-1);

        const changePercent =
            ((last.c - first.c) / first.c) * 100;

        results.push({
            ticker,
            price: last.c,
            monthChangePercent: +changePercent.toFixed(2),
            monthHigh: Math.max(...data.results.map(d => d.h)),
            monthLow: Math.min(...data.results.map(d => d.l))
        });
    }

    return results;
}

/* helpers */
function formatDate(date) {
    return date.toISOString().split("T")[0];
}

function getLastMonthRange() {
    const to = new Date();
    const from = new Date();
    from.setMonth(to.getMonth() - 1);
    return { from: formatDate(from), to: formatDate(to) };
}
