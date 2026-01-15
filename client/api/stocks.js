const API_URL = "https://stock-assistant-api.onrender.com";

export async function fetchStock(tickers) {
    const res = await fetch(`${API_URL}/api/stocks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ tickers })
    });

    if (!res.ok) {
        throw new Error("Backend error");
    }

    return res.json();
}