import { initializePage } from './common.js';
import { formatTimestamp, showLocalTime, addIncidentCardListeners, navigateToSearch } from './utils.js';
// Import translations and language utilities from translation-dictionary.js
import { translations, languages, currentLanguageIndex, setLanguage } from './translation-dictionary.js';

document.addEventListener("DOMContentLoaded", async () => {
    initializePage("killmail_detail");

    const urlParams = new URLSearchParams(window.location.search);
    const tempKey = urlParams.get('tempKey');

    const killmailContentEl = document.getElementById('killmail-content');
    const pageTitleContainerEl = document.getElementById('killmail-page-title-container');
    const documentTitleEl = document.querySelector('title');

    // Helper to get translations
    const getTranslation = (key, fallbackText = '', params = {}) => {
        const lang = languages[currentLanguageIndex]; // Get current language
        let text = (translations[key] && translations[key][lang]) || 
                   (translations[key] && translations[key].en) || // Fallback to English
                   fallbackText || key;
        for (const p in params) {
            text = text.replace(new RegExp(`{${p}}`, 'g'), params[p]);
        }
        return text;
    };
    
    // Updated getGeneralTranslation function
    const getGeneralTranslation = (value, generalKeyIfEmpty) => {
        // Check for null, undefined, or an empty string.
        // For non-string types like numbers, this check will ensure they are not considered "empty"
        // unless they are explicitly null or undefined.
        if (value === null || value === undefined || (typeof value === 'string' && value.trim() === "")) {
            // If the value is considered empty, get the generic translated term (e.g., "UNKNOWN", "N/A")
            return getTranslation(`general.${generalKeyIfEmpty.toLowerCase()}`);
        }
        // Otherwise, return the value itself, converted to a string for display.
        // This ensures numbers like solar_system_id are displayed.
        return String(value);
    };

    if (tempKey) {
        try {
            const storedItemJson = sessionStorage.getItem(tempKey);
            if (!storedItemJson) {
                throw new Error(getTranslation("error.killmailLoadFailed", "Killmail data not found in session."));
            }

            const data = JSON.parse(storedItemJson);

            function renderKillmailDetailsHTML(killmailData) {
                const victimName = getGeneralTranslation(killmailData.victim_name, "unknown");
                // killer_name can be an empty string from API, which getGeneralTranslation will handle
                const killerNameDisplay = getGeneralTranslation(killmailData.killer_name, "notApplicable"); 
                const solarSystemName = getGeneralTranslation(killmailData.solar_system_name, "unknown");
                const lossType = getGeneralTranslation(killmailData.loss_type, "classified");
                // solar_system_id is a number; getGeneralTranslation will now handle it correctly
                const solarSystemId = getGeneralTranslation(killmailData.solar_system_id, "notApplicable");


                documentTitleEl.textContent = getTranslation("killmail.pageTitlePattern", "Killmail Details", { killerName: killerNameDisplay, victimName: victimName });
                
                if (pageTitleContainerEl) {
                    pageTitleContainerEl.innerHTML = `
                        <h1>
                            <span class="killer">${killerNameDisplay}</span> 
                            <span class="text-primary">${getTranslation("killmail.headerVs", "vs")}</span> 
                            <span class="victim">${victimName}</span>
                        </h1>
                        <p class="system-location">
                            ${getTranslation("killmail.headerIncidentIn", "Incident in")} 
                            <span class="clickable-system" data-system="${solarSystemName}">${solarSystemName}</span>
                        </p>
                    `;
                }

                const profilePic = "../assets/images/awakened.avif";
                const victimShipPlaceholder = killmailData.loss_type === 'ship' || killmailData.loss_type === 'pod' 
                    ? lossType 
                    : getTranslation("killmail.placeholder.victimShip", "[Ship Placeholder]");

                let html = `
                <div class="combatants-grid-km">
                    <div class="combatant-column-km killer-column">
                         <div class="combatant-card-km killer-card-km">
                            <div class="combatant-header-km">
                                <img src="${profilePic}" alt="Killer ${killerNameDisplay}" class="profile-image">
                                <div class="combatant-info-km">
                                    <h3 class="combatant-role-label killer">${getTranslation("killmail.killerLabel", "KILLER")}</h3>
                                    <h2 class="killer clickable-name" data-name="${killerNameDisplay}" title="${getTranslation("tooltip.searchFor", "Search for {itemName}", {itemName: killerNameDisplay})}">${killerNameDisplay}</h2>
                                    <p>${getTranslation("killmail.corporationLabel", "Corporation:")} <span class="placeholder">${getTranslation("killmail.placeholder.killerCorp", "[Killer Corp Placeholder]")}</span></p>
                                    <p>${getTranslation("killmail.shipLabel", "Ship:")} <span class="placeholder">${getTranslation("killmail.placeholder.killerShip", "[Killer Ship Placeholder]")}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="combatant-column-km victim-column">
                        <div class="combatant-card-km victim-card-km">
                            <div class="combatant-header-km">
                                <img src="${profilePic}" alt="Victim ${victimName}" class="profile-image">
                                <div class="combatant-info-km">
                                    <h3 class="combatant-role-label victim">${getTranslation("killmail.victimLabel", "VICTIM")}</h3>
                                    <h2 class="victim clickable-name" data-name="${victimName}" title="${getTranslation("tooltip.searchFor", "Search for {itemName}", {itemName: victimName})}">${victimName}</h2>
                                    <p>${getTranslation("killmail.corporationLabel", "Corporation:")} <span class="placeholder">${getTranslation("killmail.placeholder.victimCorp", "[Victim Corp Placeholder]")}</span></p>
                                    <p>${getTranslation("killmail.shipLabel", "Ship:")} <span class="placeholder">${victimShipPlaceholder}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="engagement-details-km data-card">
                    <h3>${getTranslation("killmail.engagementDetailsTitle", "Engagement Details")}</h3>
                    <p><strong>${getTranslation("killmail.lossTypeLabel", "Loss Type:")}</strong> ${lossType}</p>
                    <p><strong>${getTranslation("killmail.timeLabel", "Time:")}</strong> ${formatTimestamp(killmailData.time_stamp, showLocalTime)}</p>
                    <p><strong>${getTranslation("killmail.locationLabel", "Location:")}</strong> <span class="clickable-system" data-system="${solarSystemName}">${solarSystemName}</span> (${getTranslation("card.idLabel", "ID:")} ${solarSystemId})</p>
                </div>

                <div class="fitting-section-km data-card">
                    <h3>${getTranslation("killmail.fittingTitle", "Ship Fitting & Contents")}</h3>
                    <p class="note" style="text-align: left; margin-bottom: 15px; background-color: rgba(var(--color-bg-medium-rgb, 26, 26, 26), 0.7); border-left: 3px solid var(--color-secondary); padding: 10px;">
                        <i class="fas fa-info-circle"></i> ${getTranslation("killmail.fittingNote", "Note: Fitting data is placeholder.")}
                    </p>
                    <div class="fitting-table-km">
                        <details class="fitting-category" open>
                            <summary><i class="fas fa-crosshairs"></i> ${getTranslation("killmail.fitting.highSlots", "High Slots")}</summary>
                            <ul>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.highSlotItem1")}</span> <span class="placeholder">${getTranslation("killmail.placeholder.highSlotAmmo1")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.highSlotItem1")}</span> <span class="placeholder">${getTranslation("killmail.placeholder.highSlotAmmo1")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.highSlotItem2")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.emptyHighSlot")}</span></li>
                            </ul>
                        </details>
                        <details class="fitting-category" open>
                            <summary><i class="fas fa-shield-alt"></i> ${getTranslation("killmail.fitting.midSlots", "Mid Slots")}</summary>
                            <ul>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.midSlotItem1")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.midSlotItem2")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.midSlotItem3")}</span></li>
                            </ul>
                        </details>
                        <details class="fitting-category" open>
                            <summary><i class="fas fa-cogs"></i> ${getTranslation("killmail.fitting.lowSlots", "Low Slots")}</summary>
                            <ul>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.lowSlotItem1")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.lowSlotItem2")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.lowSlotItem3")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.lowSlotItem3")}</span></li>
                            </ul>
                        </details>
                        <details class="fitting-category" open>
                            <summary><i class="fas fa-microchip"></i> ${getTranslation("killmail.fitting.rigs", "Rigs")}</summary>
                            <ul>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.rigSlotItem1")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.rigSlotItem2")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.rigSlotItem3")}</span></li>
                            </ul>
                        </details>
                        <details class="fitting-category" open>
                            <summary><i class="fas fa-fighter-jet"></i> ${getTranslation("killmail.fitting.drones", "Drones")}</summary>
                            <ul>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.droneItem1")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.droneItem2")}</span></li>
                            </ul>
                        </details>
                         <details class="fitting-category" open>
                            <summary><i class="fas fa-cubes"></i> ${getTranslation("killmail.fitting.ammoCharges", "Ammunition / Charges")}</summary>
                            <ul>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.ammoItem1")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.ammoItem2")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.ammoItem3")}</span></li>
                            </ul>
                        </details>
                        <details class="fitting-category" open>
                            <summary><i class="fas fa-box-open"></i> ${getTranslation("killmail.fitting.cargoHold", "Cargo Hold")}</summary>
                            <ul>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.cargoItem1")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.cargoItem2")}</span></li>
                                <li><span class="placeholder">${getTranslation("killmail.placeholder.cargoItem3")}</span></li>
                            </ul>
                        </details>
                    </div>
                </div>
                `;
                return html;
            }

            killmailContentEl.innerHTML = renderKillmailDetailsHTML(data);

            if (typeof addIncidentCardListeners === 'function') {
                addIncidentCardListeners();
            }
            const currentLang = localStorage.getItem("preferredLanguage") || languages[0];
            if (typeof setLanguage === 'function') {
                setLanguage(currentLang);
            }

        } catch (error) {
            console.error("Failed to load killmail data from session:", error);
            killmailContentEl.innerHTML = `<p class="error">${getTranslation("error.killmailLoadFailed", error.message || "Failed to load killmail data.")}</p>`;
            const currentLang = localStorage.getItem("preferredLanguage") || languages[0];
            if (typeof setLanguage === 'function') {
                setLanguage(currentLang);
            }
        }
    } else {
        killmailContentEl.innerHTML = `<p class="error">${getTranslation("error.noKillmailId", "No killmail reference provided.")}</p>`;
        const currentLang = localStorage.getItem("preferredLanguage") || languages[0];
        if (typeof setLanguage === 'function') {
            setLanguage(currentLang);
        }
    }
});