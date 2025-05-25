/**
 * Fetches the totals data from the API and renders the appropriate metric.
 * @param {string} metric - One of "top_systems", "top_killers", or "top_victims"
 * @param {string} tableId - The ID of the table element to display the data in.
 */
async function fetchAndDisplayMetric(metric, tableId) {
  try {
    // Ensure you are using the correct URL:
    const response = await fetch("https://api.alpha-strike.space/totals?filter=month");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Parse the response as JSON.
    const data = await response.json();
    
    // Pick the data for the selected metric.
    const metricData = data[metric];

    // Remove the "Loading" message.
    document.getElementById("data-container").textContent = "";

    // Unhide the table.
    const table = document.getElementById(tableId);
    table.style.display = "table";
    
    // Get the table body and clear any existing rows.
    const tableBody = table.querySelector("tbody");
    tableBody.innerHTML = "";
    
    // Loop through the metric data and create table rows.
    metricData.forEach(item => {
      const tr = document.createElement("tr");
      
      // Use conditional logic to build the cells based on the metric type.
      if (metric === "top_systems") {
        // For systems, use solar_system_name and incident_count.
        const tdName = document.createElement("td");
        tdName.textContent = item.solar_system_name;
        const tdCount = document.createElement("td");
        tdCount.textContent = item.incident_count;
        tr.appendChild(tdName);
        tr.appendChild(tdCount);
      } else if (metric === "top_killers") {
        // For killers, use name and kills.
        const tdName = document.createElement("td");
        tdName.textContent = item.name;
        const tdKills = document.createElement("td");
        tdKills.textContent = item.kills;
        tr.appendChild(tdName);
        tr.appendChild(tdKills);
      } else if (metric === "top_victims") {
        // For victims, use name and losses.
        const tdName = document.createElement("td");
        tdName.textContent = item.name;
        const tdLosses = document.createElement("td");
        tdLosses.textContent = item.losses;
        tr.appendChild(tdName);
        tr.appendChild(tdLosses);
      }
      
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("data-container").textContent = "Failed to load data.";
  }
}
