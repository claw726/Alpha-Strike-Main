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
    const dataContainer = document.getElementById("data-container");
    if (dataContainer) {
      dataContainer.textContent = "";
    }

    // Show the table
    const table = document.getElementById(tableId);
    if (!table) {
      console.error(`Table with ID ${tableId} not found.`);
      return;
    }
    table.style.display = "table";

    // Get the table body and clear any existing rows
    const tableBody = table.querySelector("tbody");
    if (!tableBody) {
      console.error(`Table body not found in table with ID ${tableId}.`);
      return;
    }
    tableBody.innerHTML = "";

    // Create table rows based on metric type
    if (metricData && Array.isArray(metricData)) {
      metricData.forEach((item) => {
        const tr = document.createElement("tr");
        let nameCellContent = "";
        let valueCellContent = "";

        if (metric === "top_systems") {
          const systemName = item.solar_system_name || "UNKNOWN";
          nameCellContent = `<span class="clickable-system" data-system="${systemName}" title="Click to search for ${systemName}">${systemName}<i class="fa-sharp fa-solid fa-arrow-up-right-from-square"></i></span>`;
          valueCellContent = item.incident_count;
        } else if (metric === "top_killers") {
          const killerName = item.name || "UNKNOWN";
          nameCellContent = `<span class="clickable-name" data-name="${killerName}" title="Click to search for ${killerName}">${killerName}<i class="fa-sharp fa-solid fa-arrow-up-right-from-square"></i></span>`;
          valueCellContent = item.kills;
        } else if (metric === "top_victims") {
          const victimName = item.name || "UNKNOWN";
          nameCellContent = `<span class="clickable-name" data-name="${victimName}" title="Click to search for ${victimName}">${victimName}<i class="fa-sharp fa-solid fa-arrow-up-right-from-square"></i></span>`;
          valueCellContent = item.losses;
        }

        tr.innerHTML = `
                    <td>${nameCellContent}</td>
                    <td>${valueCellContent}</td>
                `;
        tableBody.appendChild(tr);
      });
    } else {
      console.warn(`No data or invalid data format for metric: ${metric}`);
      if (dataContainer) {
        dataContainer.textContent = "No data available for this metric.";
      }
    }

    // Add event listeners after table is populated
    addTableClickListeners(tableId);
  } catch (error) {
    console.error("Error fetching or displaying metric data:", error);
    const dataContainer = document.getElementById("data-container");
    if (dataContainer) {
      dataContainer.textContent = "Failed to load data.";
    }
  }
}

/**
 * Add click event listeners to table cells for navigation.
 * This should be called after the table is populated.
 * @param {string} tableId - The ID of the table to add listeners to.
 */
function addTableClickListeners(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  // Add listeners for clickable names
  table.querySelectorAll(".clickable-name").forEach((element) => {
    element.style.cursor = "pointer"; // Add pointer cursor
    element.addEventListener("click", (e) => {
      e.preventDefault();
      const name = element.dataset.name;
      if (
        name &&
        name !== "UNKNOWN" &&
        typeof navigateToSearch === "function"
      ) {
        navigateToSearch(name, "name");
      } else if (typeof navigateToSearch !== "function") {
        console.error(
          "navigateToSearch function is not defined. Make sure utils.js is loaded.",
        );
      }
    });
  });

  // Add listeners for clickable systems
  table.querySelectorAll(".clickable-system").forEach((element) => {
    element.style.cursor = "pointer"; // Add pointer cursor
    element.addEventListener("click", (e) => {
      e.preventDefault();
      const system = element.dataset.system;
      if (
        system &&
        system !== "UNKNOWN" &&
        typeof navigateToSearch === "function"
      ) {
        navigateToSearch(system, "system");
      } else if (typeof navigateToSearch !== "function") {
        console.error(
          "navigateToSearch function is not defined. Make sure utils.js is loaded.",
        );
      }
    });
  });
}
