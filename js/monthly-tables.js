/**
 * Fetches the totals data from the API and renders the appropriate metric.
 * @param {string} metric - One of "top_systems", "top_killers", or "top_victims"
 * @param {string} tableId - The ID of the table element to display the data in.
 */
async function fetchAndDisplayMetric(metric, tableId) {
  const CACHE_KEY_PREFIX = "monthly_totals_";
  const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

  const cacheKey = `${CACHE_KEY_PREFIX}${metric}`;
  const dataContainer = document.getElementById("data-container");
  const table = document.getElementById(tableId);
  const tableBody = table ? table.querySelector("tbody") : null;

  if (!table || !tableBody) {
    console.error(`Table or table body not found for ID ${tableId}`);
    if (dataContainer) {
      dataContainer.textContent = "Error: UI Elements Missing.";
    }
    return;
  }

  // Attempt to load from cache first
  try {
    const cachedItem = localStorage.getItem(cacheKey);
    if (cachedItem) {
      const { timestamp, data } = JSON.parse(cachedItem);
      if (Date.now() - timestamp < CACHE_DURATION_MS) {
        console.log(`Using cached data for metric: ${metric}`);
        const metricData = data[metric];
        displayMetricDataInTable(
          metricData,
          table,
          tableBody,
          metric,
          dataContainer,
        );
        return;
      } else {
        console.log(`Cache expired for metric: ${metric}`);
        localStorage.removeItem(cacheKey);
      }
    }
  } catch (error) {
    console.error("Error reading from localstorage:", error);
  }

  try {
    if (dataContainer) {
      dataContainer.innerHTML = `<p data-translate="loading.data">Loading data...</p>`;
    }

    const apiData = await fetchMonthlyTotals();

    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ timestamp: Date.now(), data: apiData }),
      );
    } catch (error) {
      console.error("Error writing to localstorage:", error);
    }

    const metricData = apiData[metric];
    displayMetricDataInTable(
      metricData,
      table,
      tableBody,
      metric,
      dataContainer,
    );
  } catch (error) {
    dataContainer.innerHTML = `<p data-translate="error.loadFailed">Failed to load data.</p>`;
  }
}

/**
 * Helper function to display metric data in the table.
 * This separates the display logic from the fetching/caching logic.
 * @param {Array} metricData - The actual data array for the metric (e.g., data.top_killers)
 * @param {HTMLElement} table - The table element
 * @param {HTMLElement} tableBody - The tbody element of the table
 * @param {string} metric - The metric type ("top_systems", "top_killers", "top_victims")
 * @param {HTMLElement} dataContainer - The loading/message container
 */
function displayMetricDataInTable(
  metricData,
  table,
  tableBody,
  metric,
  dataContainer,
) {
  if (dataContainer) {
    dataContainer.innerHTML = "";
  }
  table.style.display = "table";
  tableBody.innerHTML = "";

  if (metricData && Array.isArray(metricData) && metricData.length > 0) {
    [...metricData].map((item) => {
      const tr = document.createElement("tr");
      let nameCellContent = "";
      let valueCellContent = "";

      if (metric === "top_systems") {
        const systemName = item.solar_system_name || "UNKNOWN";
        nameCellContent = `<span class="clickable-system" data-system="${systemName}" title="Click to search for ${systemName}">${systemName}<i class="fas fa-arrow-up-right-from-square"></i></span>`;
        valueCellContent = item.kills || item.incident_count || 0;
      } else if (metric === "top_killers" || metric === "top_victims") {
        const characterName = item.name || "UNKNOWN";
        nameCellContent = `<span class="clickable-name" data-name="${characterName}" title="Click to search for ${characterName}">${characterName}<i class="fas fa-arrow-up-right-from-square"></i></span>`;
        valueCellContent =
          metric === "top_killers"
            ? item.kills || item.incident_count || 0
            : item.losses || item.incident_count || 0;
      }

      tr.innerHTML = `
        <td>${nameCellContent}</td>
        <td>${valueCellContent}</td>
      `;
      tableBody.appendChild(tr);
    });
  } else {
    console.warn(`No data or invalid data for metric: ${metric}`);
    if (dataContainer) {
      dataContainer.innerHTML = `<p data-translate="error.noData">No data or invalid data for metric: ${metric}</p>`;
      table.style.display = "none";
    }
  }

  addTableClickListeners(table.id);

  if (
    typeof setLanguage === "function" &&
    typeof languages !== "undefined" &&
    languages.length > 0
  ) {
    const currentLang =
      localStorage.getItem("preferredLanguage") || languages[0];
    setLanguage(currentLang);
  }
}

/**
 * Add click event listeners to table cells for navigation.
 * This should be called after the table is populated.
 * @param {string} tableId - The ID of the table to add listeners to.
 */
function addTableClickListeners(tableId) {
  const table = document.getElementById(tableId);
  if (!table) {
    console.error(`Table with ID ${tableId} not found.`);
    return;
  }

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
