
// Global var to track timezone prefs
let showLocalTime = true;

/**
 * Function to format the timestamp in user's local time
 * @param {number} timestamp - The Windows FILETIME timestamp
 * @param {boolean} showLocal - Whether to show local time (default: true)
 * @returns {string} - Formatted timestamp string
 */
function formatTimestamp(timestamp, showLocal = true) {
    let date;

    // Try different timestamp formats to determine the correct one
    if (typeof timestamp === 'string') {
        // If it's already a string, try to parse it
        date = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
        // Check if it's a Unix timestamp (seconds since 1970)
        if (timestamp < 10000000000) {
            // Likely Unix timestamp in seconds
            date = new Date(timestamp * 1000);
        } else if (timestamp < 10000000000000) {
            // Likely Unix timestamp in milliseconds
            date = new Date(timestamp);
        } else {
            // This is a Windows FILETIME timestamp (100-nanosecond intervals since Jan 1, 1601)
            // Convert to milliseconds since 1601
            const msSince1601 = timestamp / 10000;
            // Calculate the difference between Jan 1, 1601 and Jan 1, 1970 in milliseconds
            const epochDifference = 11644473600000; // Correct value: 11,644,473,600,000 ms
            // Convert to Unix timestamp in milliseconds (since Jan 1, 1970)
            const msSince1970 = msSince1601 - epochDifference;
            date = new Date(msSince1970);
        }
    }

    // Validate the date
    if (!date || Number.isNaN(date.getTime()) || date.getFullYear() > 2100 || date.getFullYear() < 1970) {
        console.warn('Invalid timestamp:', timestamp);
        return 'INVALID TIMESTAMP';
    }

    if (showLocal) {
        // Format as local time with timezone info
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Get timezone abbreviation
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timeZoneShort = date.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2];

        // Return in military/sci-fi format with local timezone
        return `${year}.${month}.${day} - ${hours}:${minutes}:${seconds} ${timeZoneShort}`;
    }
    // Format as UTC (original behavior)
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    // Return in military/sci-fi format: YYYY.MM.DD - HH:MM:SS UTC
    return `${year}.${month}.${day} - ${hours}:${minutes}:${seconds} UTC`;
}

/**
 * Toggle between local time and UTC display
 */
function toggleTimezone() {
    showLocalTime = !showLocalTime;

    // Update all timestamp displays
    const timestampElements = document.querySelectorAll('.timestamp-value');
    [...timestampElements].map(element => {
        const card = element.closest('.incident-card');
        if (card?.dataset.timestamp) {
            element.textContent = formatTimestamp(Number.parseInt(card.dataset.timestamp), showLocalTime);
        }
    });

    // Update toggle button text
    const toggleBtn = document.getElementById('timezone-toggle');
    if (toggleBtn) {
        toggleBtn.innerHTML = showLocalTime ?
            '<i class="far fa-clock"></i> Show UTC' :
            '<i class="far fa-clock"></i> Show Local';
    }

    // Update label text
    const timestampLabels = document.querySelectorAll('.detail-label[data-translate="card.timestamp"]');
    [...timestampLabels].map(label => {
        label.textContent = showLocalTime ? 'LOCAL TIME:' : 'UTC TIME:';
    });
}

/**
 * Function to calculate time elapsed since incident
 * @param {number} timestamp - The timestamp
 * @returns {string} - Human readable time elapsed
 */
function getTimeElapsed(timestamp) {
    let incidentTime;

    // Use the same logic as formatTimestamp to get the correct date
    if (typeof timestamp === 'string') {
        incidentTime = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
        if (timestamp < 10000000000) {
            incidentTime = new Date(timestamp * 1000);
        } else if (timestamp < 10000000000000) {
            incidentTime = new Date(timestamp);
        } else {
            // Windows FILETIME conversion
            const msSince1601 = timestamp / 10000;
            const epochDifference = 11644473600000;
            const msSince1970 = msSince1601 - epochDifference;
            incidentTime = new Date(msSince1970);
        }
    }

    // Validate the date
    if (!incidentTime || Number.isNaN(incidentTime.getTime()) || incidentTime.getFullYear() > 2100 || incidentTime.getFullYear() < 1970) {
        return '';
    }

    const now = new Date();
    const diffMs = now - incidentTime;

    // If the incident is in the future, return empty string
    if (diffMs < 0) {
        return '';
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
        return `${diffDays}d ${diffHours}h ago`;
    }
    if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}m ago`;
    }
    if (diffMinutes > 0) {
        return `${diffMinutes}m ago`;
    }
    return "Just now";
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
    const isEffectivelyEmpty = (
        !item.killer_name &&
        !item.victim_name &&
        !item.loss_type &&
        !item.solar_system_name &&
        !item.time_stamp
    );

    if (isEffectivelyEmpty) {
        console.warn("Skipping card creation for item with all essential fields missing:", item);
        return null;
    }

    const card = document.createElement("div");
    card.classList.add("data-card", "incident-card");

    // Store the raw timestamp for timezone toggling
    if (item.time_stamp) {
        card.dataset.timestamp = item.time_stamp;
    }

    // Determine base path for assets based on the HTML page's location
    const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    const assetBasePath = isIndexPage ? '' : '../';

    // Format timestamp in local time and get elapsed time
    const formattedTimestamp = item.time_stamp ? formatTimestamp(item.time_stamp, true) : 'N/A';
    const timeElapsed = item.time_stamp ? getTimeElapsed(item.time_stamp) : '';

    const timeLabel = showLocalTime ? 'LOCAL TIME:' : 'UTC TIME:';

    card.innerHTML = `
        <div class="incident-header">
            <div class="incident-status">
                <i class="fas fa-skull-crossbones"></i>
                <span class="status-text">COMBAT INCIDENT</span>
            </div>
            <div class="incident-id">
                <span class="id-label">ID:</span>
                <span class="id-value">${item.solar_system_id || 'UNKNOWN'}</span>
            </div>
        </div>

        <div class="combatants">
            <div class="combatant killer-section">
                <div class="combatant-label">
                    <i class="fas fa-crosshairs"></i>
                    <span data-translate="card.aggressor">AGGRESSOR</span>
                </div>
                <div class="combatant-name killer">${item.killer_name || 'UNKNOWN'}</div>
            </div>

            <div class="vs-divider">
                <img src="${assetBasePath}assets/images/pew.png" alt="vs" class="vs-icon" />
                <div class="vs-line"></div>
            </div>

            <div class="combatant victim-section">
                <div class="combatant-label">
                    <i class="fas fa-shield-halved"></i>
                    <span data-translate="card.casualty">CASUALTY</span>
                </div>
                <div class="combatant-name victim">${item.victim_name || 'UNKNOWN'}</div>
            </div>
        </div>

        <div class="incident-details">
            <div class="detail-row">
                <div class="detail-item">
                    <i class="fas fa-tag"></i>
                    <span class="detail-label" data-translate="card.lossType">LOSS TYPE:</span>
                    <span class="detail-value">${item.loss_type || 'CLASSIFIED'}</span>
                </div>
            </div>

            <div class="detail-row">
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span class="detail-label" data-translate="card.location">LOCATION:</span>
                    <span class="detail-value">${item.solar_system_name || 'UNKNOWN SECTOR'}</span>
                </div>
            </div>

            <div class="detail-row timestamp-row">
                <div class="detail-item">
                    <i class="far fa-clock"></i>
                    <span class="detail-label" data-translate="card.timestamp">${timeLabel}</span>
                    <span class="detail-value timestamp-value">${formattedTimestamp}</span>
                </div>
                ${timeElapsed ? `<div class="time-elapsed">${timeElapsed}</div>` : ''}
            </div>
        </div>

        <div class="incident-footer">
            <div class="threat-level">
                <span class="threat-indicator"></span>
                <span class="threat-text">HOSTILE ACTIVITY CONFIRMED</span>
            </div>
        </div>
    `;

    return card;
}

/**
 * Debug function to help identify timestamp format
 * @param {*} timestamp - The timestamp to analyze
 */
function debugTimestamp(timestamp) {
    console.log('=== Timestamp Debug ===');
    console.log('Raw timestamp:', timestamp);
    console.log('Type:', typeof timestamp);

    if (typeof timestamp === 'number') {
        console.log('As Unix seconds:', new Date(timestamp * 1000));
        console.log('As Unix milliseconds:', new Date(timestamp));
        console.log('As microseconds:', new Date(timestamp / 1000));
        console.log('As nanoseconds:', new Date(timestamp / 10000));

        // Windows FILETIME conversion
        const msSince1601 = timestamp / 10000;
        const epochDifference = 11644473600000;
        const msSince1970 = msSince1601 - epochDifference;
        const date = new Date(msSince1970);
        console.log('As Windows FILETIME (UTC):', date.toUTCString());
        console.log('As Windows FILETIME (Local):', date.toString());
    }
    console.log('======================');
}