/**
 * Function to format the timestamp if needed.
 * Check your API docs to understand the timestamp's unit.
 */
function formatTimestamp(ldapTimestamp) {
    // Convert the LDAP timestamp (in 100-nanosecond intervals) to milliseconds since 1601
    const msSince1601 = ldapTimestamp / 10000;
    // Calculate the difference between Jan 1, 1601 and Jan 1, 1970 in milliseconds
    const epochDifference = 1164447360000; // 11,644,473,600,000 ms
    // Convert to Unix timestamp in milliseconds (since Jan 1, 1970)
    const msSince1970 = msSince1601 - epochDifference;
    // Create a new Date object and return its UTC string representation
    return new Date(msSince1970).toUTCString();
}

/**
 * Creates a data card element for incident display
 * @param {Object} item - The incident data
 * @returns {HTMLElement} - The created card element
 */
function createIncidentCard(item) {
    // Validation
    if (!item || typeof item !== "object") {
        console.warn("Invalid item passed to createIncidentCard:", item);
        return null;
    }

    // Check if all essential fields would result in "N/A"
    // These are the fields that, if all missing, make the card uninformative.
    const isEffectivelyEmpty = (
        !item.killer_name &&
        !item.victim_name &&
        !item.loss_type &&
        !item.solar_system_name && 
        !item.time_stamp
    );

    if (isEffectivelyEmpty) {
        console.warn("Skipping card creation for item with all essential fields missing:", item);
        return null; // Don't create a card if it would be all N/A
    }

    const card = document.createElement("div");
    card.classList.add("data-card");

    // Determine base path for assets based on the HTML page's location
    const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    const assetBasePath = isIndexPage ? '' : '../';

    card.innerHTML = `
        <h2>
        <span class="killer"><i class="fas fa-crosshairs"></i>&nbsp;${item.killer_name || 'N/A'}</span>
        <img src="${assetBasePath}assets/images/pew.png" alt="vs" style="height:20px; vertical-align:middle;" />
        <span class="victim"><i class="fas fa-shield-halved"></i>&nbsp;${item.victim_name || 'N/A'}</span>
        </h2>
        <p><strong><i class="fas fa-tag"></i>&nbsp;<span data-translate="card.lossType">Loss Type:</span></strong> ${item.loss_type || 'N/A'}</p>
        <p><strong><i class="fas fa-sun"></i>&nbsp;<span data-translate="card.solarSystem">Solar System:</span></strong> ${item.solar_system_name || 'N/A'} (ID: ${item.solar_system_id || 'N/A'})</p>
        <p class="timestamp"><strong><i class="far fa-clock"></i>&nbsp;<span data-translate="card.timestamp">Timestamp:</span></strong> ${item.time_stamp ? formatTimestamp(item.time_stamp) : 'N/A'}</p>
        `;
    return card;
}