export async function fetchStock(tickers) {
    const res = await fetch("http://localhost:3000/api/stocks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickers }),
    });

    if (!res.ok) {
        throw new Error("Backend error");
    }

    const data = await res.json();
    console.log(data.stocks);
    console.log(data.report);

    return data;
}