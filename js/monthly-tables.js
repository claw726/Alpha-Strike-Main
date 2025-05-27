/**
 * Fetches the totals data from the API and renders the appropriate metric.
 * @param {string} metric - One of "top_systems", "top_killers", or "top_victims"
 * @param {string} tableId - The ID of the table element to display the data in.
 */
async function fetchAndDisplayMetric(metric, tableId) {
    try {
        const data = await fetchMonthlyTotals();
        const metricData = data[metric];

        // Remove the "Loading" message
        document.getElementById("data-container").textContent = "";

        // Show the table
        const table = document.getElementById(tableId);
        table.style.display = "table";

        // Get the table body and clear any existing rows
        const tableBody = table.querySelector("tbody");
        tableBody.innerHTML = "";

        // Create table rows based on metric type
        [...metricData].map(item => {
            const tr = document.createElement("tr");

            if (metric === "top_systems") {
                tr.innerHTML = `
                    <td>${item.solar_system_name}</td>
                    <td>${item.incident_count}</td>
                `;
            } else if (metric === "top_killers") {
                tr.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.kills}</td>
                `;
            } else if (metric === "top_victims") {
                tr.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.losses}</td>
                `;
            }

            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("data-container").textContent = "Failed to load data.";
    }
}