
import { fetchStock } from "./api/stocks.js";

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("ticker-form");
const tickerInput = document.getElementById("ticker-input");
const tickerContainer = document.getElementById("tickerContainer");
const generateBtn = document.getElementById("generateReport");

const actionPanel = document.querySelector(".action-panel");
const loadingPanel = document.querySelector(".loading-panel");
const outputPanel = document.querySelector(".output-panel");
const apiMessage = document.getElementById("api-message");

const loader = document.getElementById("loader");

const tickersArr = [];

/* ------------------------
   ADD TICKER
------------------------ */
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTicker = tickerInput.value.toUpperCase().trim();

    if (newTicker.length < 3) {
        showError(
            "A ticker must be at least 3 characters (e.g. TSLA)."
        );
        return;
    }

    if (tickersArr.includes(newTicker)) {
        showError("Ticker already added.");
        return;
    }

    if (tickersArr.length >= 3) {
        showError("You can only add up to 3 tickers.");
        return;
    }

    clearError();
    tickersArr.push(newTicker);
    tickerInput.value = "";
    renderTickers();

    generateBtn.disabled = tickersArr.length === 0;
});


/* ------------------------
   Loading states
------------------------ */


function showLoading(message) {
    loadingPanel.classList.remove("hidden");
    loader.classList.remove("hidden");
    apiMessage.textContent = message;
}

function showLoadingError(message) {
    loader.classList.add("hidden");
    apiMessage.textContent = message;
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



/* ------------------------
   RENDER TICKERS
------------------------ */
function renderTickers() {
    tickerContainer.innerHTML = "";

    tickersArr.forEach((ticker) => {
        const span = document.createElement("span");
        span.className = "text-slate-200 font-semibold tracking-wide uppercase";
        span.textContent = ticker;
        tickerContainer.appendChild(span);
    });

    if (tickersArr.length === 0) {
        tickerContainer.innerHTML =
            `<span class="italic text-slate-400">Selected tickers will appear here</span>`;
    }

}

/* ------------------------
   RESET TICKERS
------------------------ */
function resetTickers() {
    tickersArr.length = 0;
    tickerContainer.innerHTML =
        `<span class="italic text-slate-400">Selected tickers will appear here</span>`
    generateBtn.disabled = true;
}

/* ------------------------
   GENERATE REPORT
------------------------ */
generateBtn.addEventListener("click", fetchStockData);

async function fetchStockData() {
    actionPanel.classList.add("hidden");
    outputPanel.classList.add("hidden");

    showLoading("Querying Stocks API...");

    try {
        const data = await fetchStock(tickersArr);

        apiMessage.textContent = "Creating report...";
        await delay(800);

        renderReport(data.report); // ✅ THIS IS THE ONLY CALL

    } catch (err) {
        await delay(700);

        showLoadingError("Failed to fetch stock data.");

        await delay(1200);
        resetToHome(3000);

        console.error(err);
    }
}



function resetToHome(delay = 3000) {
    setTimeout(() => {
        loadingPanel.classList.add("hidden");
        outputPanel.classList.add("hidden");
        actionPanel.classList.remove("hidden");

        apiMessage.textContent = "";
        resetTickers();
        generateBtn.disabled = tickersArr.length === 0;
    }, delay);
}

/* ------------------------
   REPORT OUTPUT
------------------------ */
// async function fetchReport(data) {
//     try {
//         // AI logic will go here
//         await new Promise(resolve => setTimeout(resolve, 1500));
//         renderReport("Mock report output goes here.");
//     } catch (err) {
//         apiMessage.textContent =
//             "There was an error generating the report. Returning to home...";
//         console.error(err);
//         resetToHome(3000);
//     }
// }


function renderReport(output) {
    loader.classList.add("hidden");
    loadingPanel.classList.add("hidden");


    outputPanel.classList.remove("hidden");
    outputPanel.innerHTML = `
            <h2 class="text-lg font-semibold mb-2">Your Report 😜</h2>
            <p class="text-slate-300 leading-relaxed">${output}</p>
            `;
}

/* ------------------------
   ERROR HANDLING
------------------------ */
function showError(message) {
    const label = document.querySelector("label");
    label.style.color = "red";
    label.textContent = message;
}

function clearError() {
    const label = document.querySelector("label");
    label.style.color = "";
}
