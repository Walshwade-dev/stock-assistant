// function that formats a date to 'YYYY-MM-DD'

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// function to get n days ago from today

function getNDaysAgo(n) {
    const now = new Date();
    now.setDate(now.getDate() - n);
    return formatDate(now);
}

export const dates = {
    startDate: getNDaysAgo(3),
    endDate: getNDaysAgo(1)
}