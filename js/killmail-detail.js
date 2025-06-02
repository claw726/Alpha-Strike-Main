import { initializePage } from './common.js';
import { formatTimestamp, showLocalTime, addIncidentCardListeners, navigateToSearch } from './utils.js';
import { fetchIncidentById } from './api.js';
// Import translations and language utilities from translation-dictionary.js
import { translations, languages, currentLanguageIndex, setLanguage, loadTranslations } from './translation-dictionary.js';

let killmailDataStore = null; // Store fetched killmail data here

// Local helper to get translations, ensuring it uses the up-to-date currentLanguageIndex
const getTranslationLocal = (key, fallbackText = '', params = {}) => {
    const lang = languages[currentLanguageIndex]; // Uses the current language index from translation-dictionary
    let text = (translations[key]?.[lang]) ||
               (translations[key]?.en) || // Fallback to English
               fallbackText || key;
    for (const p in params) {
        text = text.replace(new RegExp(`{${p}}`, 'g'), params[p]);
    }
    return text;
};

// Local helper for general translations
const getGeneralTranslationLocal = (value, generalKeyIfEmpty) => {
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === "")) {
        return getTranslationLocal(`general.${generalKeyIfEmpty.toLowerCase()}`, generalKeyIfEmpty);
    }
    return String(value);
};

// This function now only focuses on rendering the HTML using provided data
function renderKillmailDetailsHTML(data) {
    const killmailContentEl = document.getElementById('killmail-content');
    const pageTitleContainerEl = document.getElementById('killmail-page-title-container');
    const documentTitleEl = document.querySelector('title');

    if (!killmailContentEl || !pageTitleContainerEl || !documentTitleEl) {
        console.error("One or more essential DOM elements for killmail detail page are missing.");
        if(killmailContentEl) killmailContentEl.innerHTML = `<p class="error">${getTranslationLocal("error.generic", "An error occurred.")}</p>`;
        return;
    }
    
    if (!data) {
        killmailContentEl.innerHTML = `<p class="error">${getTranslationLocal("error.killmailLoadFailed", "Killmail data is not available to render.")}</p>`;
        return;
    }

    const victimName = getGeneralTranslationLocal(data.victim_name, "unknown");
    const killerNameDisplay = getGeneralTranslationLocal(data.killer_name, "notApplicable");
    const solarSystemName = getGeneralTranslationLocal(data.solar_system_name, "unknown");
    const lossType = getGeneralTranslationLocal(data.loss_type, "classified");
    const solarSystemId = getGeneralTranslationLocal(data.solar_system_id, "notApplicable");

    documentTitleEl.textContent = getTranslationLocal("killmail.pageTitlePattern", "Killmail: {killerName} vs {victimName}", { killerName: killerNameDisplay, victimName: victimName });

    pageTitleContainerEl.innerHTML = `
        <h1>
            <span class="killer clickable-name" data-name="${killerNameDisplay}" title="${getTranslationLocal("tooltip.searchFor", "Search for {itemName}", {itemName: killerNameDisplay})}">${killerNameDisplay}</span>
            <span class="text-primary">${getTranslationLocal("killmail.headerVs", "vs")}</span>
            <span class="victim clickable-name" data-name="${victimName}" title="${getTranslationLocal("tooltip.searchFor", "Search for {itemName}", {itemName: victimName})}">${victimName}</span>
        </h1>
        <p class="system-location">
            ${getTranslationLocal("killmail.headerIncidentIn", "Incident in")}
            <span class="clickable-system" data-system="${solarSystemName}" title="${getTranslationLocal("tooltip.searchFor", "Search for {itemName}", {itemName: solarSystemName})}">${solarSystemName}</span>
        </p>
    `;

    const profilePic = "../assets/images/awakened.avif";
    const victimShipPlaceholder = data.loss_type === 'ship' || data.loss_type === 'pod'
        ? lossType
        : getTranslationLocal("killmail.placeholder.victimShip", "[Ship Placeholder]");

    // The rest of your HTML generation logic using getTranslationLocal...
    // Ensure all text uses getTranslationLocal for dynamic updates.
    const html = `
    <div class="combatants-grid-km">
        <div class="combatant-column-km killer-column">
             <div class="combatant-card-km killer-card-km">
                <div class="combatant-header-km">
                    <img src="${profilePic}" alt="${getTranslationLocal('altText.killerImage', 'Killer {killerName}', { killerName: killerNameDisplay })}" class="profile-image">
                    <div class="combatant-info-km">
                        <h3 class="combatant-role-label killer">${getTranslationLocal("killmail.killerLabel", "KILLER")}</h3>
                        <h2 class="killer clickable-name" data-name="${killerNameDisplay}" title="${getTranslationLocal("tooltip.searchFor", "Search for {itemName}", {itemName: killerNameDisplay})}">${killerNameDisplay}</h2>
                        <p>${getTranslationLocal("killmail.corporationLabel", "Corporation:")} <span class="placeholder">${getTranslationLocal("killmail.placeholder.killerCorp", "[Killer Corp Placeholder]")}</span></p>
                        <p>${getTranslationLocal("killmail.shipLabel", "Ship:")} <span class="placeholder">${getTranslationLocal("killmail.placeholder.killerShip", "[Killer Ship Placeholder]")}</span></p>
                    </div>
                </div>
            </div>
        </div>

        <div class="combatant-column-km victim-column">
            <div class="combatant-card-km victim-card-km">
                <div class="combatant-header-km">
                    <img src="${profilePic}" alt="${getTranslationLocal('altText.victimImage', 'Victim {victimName}', { victimName: victimName })}" class="profile-image">
                    <div class="combatant-info-km">
                        <h3 class="combatant-role-label victim">${getTranslationLocal("killmail.victimLabel", "VICTIM")}</h3>
                        <h2 class="victim clickable-name" data-name="${victimName}" title="${getTranslationLocal("tooltip.searchFor", "Search for {itemName}", {itemName: victimName})}">${victimName}</h2>
                        <p>${getTranslationLocal("killmail.corporationLabel", "Corporation:")} <span class="placeholder">${getTranslationLocal("killmail.placeholder.victimCorp", "[Victim Corp Placeholder]")}</span></p>
                        <p>${getTranslationLocal("killmail.shipLabel", "Ship:")} <span class="placeholder">${victimShipPlaceholder}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="engagement-details-km data-card">
        <h3>${getTranslationLocal("killmail.engagementDetailsTitle", "Engagement Details")}</h3>
        <p><strong>${getTranslationLocal("killmail.lossTypeLabel", "Loss Type:")}</strong> ${lossType}</p>
        <p><strong>${getTranslationLocal("killmail.timeLabel", "Time:")}</strong> ${formatTimestamp(data.time_stamp, showLocalTime)}</p>
        <p><strong>${getTranslationLocal("killmail.locationLabel", "Location:")}</strong> <span class="clickable-system" data-system="${solarSystemName}" title="${getTranslationLocal("tooltip.searchFor", "Search for {itemName}", {itemName: solarSystemName})}">${solarSystemName}</span> (${getTranslationLocal("card.idLabel", "ID:")} ${solarSystemId})</p>
    </div>

    <div class="fitting-section-km data-card">
        <h3>${getTranslationLocal("killmail.fittingTitle", "Ship Fitting & Contents")}</h3>
        <p class="note">
            <i class="fas fa-info-circle"></i> ${getTranslationLocal("killmail.fittingNote", "Note: Fitting data is placeholder.")}
        </p>
        <div class="fitting-table-km">
            <details class="fitting-category" open>
                <summary><i class="fas fa-crosshairs"></i> ${getTranslationLocal("killmail.fitting.highSlots", "High Slots")}</summary>
                <ul>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.highSlotItem1", "[High Slot Item 1]")}</span> <span class="placeholder">${getTranslationLocal("killmail.placeholder.highSlotAmmo1", "[Ammo]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.highSlotItem1", "[High Slot Item 1]")}</span> <span class="placeholder">${getTranslationLocal("killmail.placeholder.highSlotAmmo1", "[Ammo]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.highSlotItem2", "[High Slot Item 2]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.emptyHighSlot", "[Empty High Slot]")}</span></li>
                </ul>
            </details>
            <details class="fitting-category" open>
                <summary><i class="fas fa-shield-alt"></i> ${getTranslationLocal("killmail.fitting.midSlots", "Mid Slots")}</summary>
                <ul>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.midSlotItem1", "[Mid Slot Item 1]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.midSlotItem2", "[Mid Slot Item 2]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.midSlotItem3", "[Mid Slot Item 3]")}</span></li>
                </ul>
            </details>
            <details class="fitting-category" open>
                <summary><i class="fas fa-cogs"></i> ${getTranslationLocal("killmail.fitting.lowSlots", "Low Slots")}</summary>
                <ul>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.lowSlotItem1", "[Low Slot Item 1]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.lowSlotItem2", "[Low Slot Item 2]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.lowSlotItem3", "[Low Slot Item 3]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.lowSlotItem3", "[Low Slot Item 3]")}</span></li>
                </ul>
            </details>
            <details class="fitting-category" open>
                <summary><i class="fas fa-microchip"></i> ${getTranslationLocal("killmail.fitting.rigs", "Rigs")}</summary>
                <ul>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.rigSlotItem1", "[Rig Slot Item 1]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.rigSlotItem2", "[Rig Slot Item 2]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.rigSlotItem3", "[Rig Slot Item 3]")}</span></li>
                </ul>
            </details>
            <details class="fitting-category" open>
                <summary><i class="fas fa-fighter-jet"></i> ${getTranslationLocal("killmail.fitting.drones", "Drones")}</summary>
                <ul>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.droneItem1", "[Drone Item 1]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.droneItem2", "[Drone Item 2]")}</span></li>
                </ul>
            </details>
             <details class="fitting-category" open>
                <summary><i class="fas fa-cubes"></i> ${getTranslationLocal("killmail.fitting.ammoCharges", "Ammunition / Charges")}</summary>
                <ul>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.ammoItem1", "[Ammo Item 1]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.ammoItem2", "[Ammo Item 2]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.ammoItem3", "[Ammo Item 3]")}</span></li>
                </ul>
            </details>
            <details class="fitting-category" open>
                <summary><i class="fas fa-box-open"></i> ${getTranslationLocal("killmail.fitting.cargoHold", "Cargo Hold")}</summary>
                <ul>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.cargoItem1", "[Cargo Item 1]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.cargoItem2", "[Cargo Item 2]")}</span></li>
                    <li><span class="placeholder">${getTranslationLocal("killmail.placeholder.cargoItem3", "[Cargo Item 3]")}</span></li>
                </ul>
            </details>
        </div>
    </div>
    `;
    killmailContentEl.innerHTML = html;

    if (typeof addIncidentCardListeners === 'function') {
        addIncidentCardListeners(); // Re-attach listeners to new DOM elements
    }
    // The main setLanguage will be called by translation-dictionary when this is triggered by a language change.
}


async function loadAndRenderKillmailPageContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const mail_id = urlParams.get('mail_id');
    const killmailContentEl = document.getElementById('killmail-content');

    if (!killmailContentEl) { // Guard against missing element
        console.error("killmail-content element not found in DOM.");
        return;
    }

    if (mail_id) {
        try {
            // Only show loading message if we don't have data stored yet
            if (!killmailDataStore) {
                killmailContentEl.innerHTML = `<p data-translate="loading.killmail">${getTranslationLocal("loading.killmail", "Loading killmail data...")}</p>`;
                // Immediately translate the loading message
                const currentLangForLoading = localStorage.getItem("preferredLanguage") || languages[0];
                if (typeof setLanguage === 'function') {
                    setLanguage(currentLangForLoading);
                }
            }

            // Fetch data only if it's not already in killmailDataStore
            if (!killmailDataStore || killmailDataStore.id !== Number.parseInt(mail_id)) { // also check if mail_id changed
                const incidentDataArray = await fetchIncidentById(mail_id);
                if (!incidentDataArray || incidentDataArray.length === 0) {
                    throw new Error(getTranslationLocal("error.killmailNotFound", "Killmail not found."));
                }
                killmailDataStore = incidentDataArray[0]; // Store/update fetched data
            }

            renderKillmailDetailsHTML(killmailDataStore); // Render using the stored or newly fetched data

        } catch (error) {
            console.error("Failed to load killmail data from API:", error);
            killmailDataStore = null; // Clear data on error
            killmailContentEl.innerHTML = `<p class="error">${getTranslationLocal("error.killmailLoadFailedApi", error.message || "Failed to load killmail data from API.")}</p>`;
        }
    } else {
        killmailDataStore = null; // Clear data if no mail_id
        killmailContentEl.innerHTML = `<p class="error">${getTranslationLocal("error.noKillmailId", "No killmail ID provided in URL.")}</p>`;
    }
    // Ensure translations for any data-translate attributes are applied after rendering
    // This is particularly for elements outside renderKillmailDetailsHTML or if it adds data-translate itself.
    const currentLang = localStorage.getItem("preferredLanguage") || languages[0];
    if (typeof setLanguage === 'function') {
        setLanguage(currentLang);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadTranslations(); // Load all translation strings first
    initializePage("killmail_detail"); // Initialize navigation, static translations

    await loadAndRenderKillmailPageContent(); // Initial fetch and render of the killmail

    // Define a global function that the translation dictionary can call to refresh this page's content
    if (typeof window.AlphaStrike === 'undefined') {
        window.AlphaStrike = {};
    }
    window.AlphaStrike.onLanguageChangeRenderContent = () => {
        console.log("Killmail page: Language change detected, re-rendering content.");
        // We have the data in killmailDataStore, so just re-render the HTML part
        if (killmailDataStore) {
            renderKillmailDetailsHTML(killmailDataStore);
        } else {
            // If for some reason data isn't stored, try fetching and rendering again
            // This might happen if the initial load failed but language was changed.
            loadAndRenderKillmailPageContent();
        }
        // The main setLanguage in translation-dictionary will handle static data-translate elements again.
        // We only needed to re-render the killmail-specific content.
    };
});