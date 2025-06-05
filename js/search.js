import { initializePage } from './common.js';
import { searchIncidents, searchTotals } from './api.js';
import { createIncidentCard, addIncidentCardListeners } from './utils.js';
import { displayAggregateCard } from './components/cards.js';

/**
 * Get URL parameters for pre-filling search
 */
function getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        query: urlParams.get("query"),
        type: urlParams.get("type"),
    };
}

/**
 * Pre-fill search form if URL parameters are present
 */
function prefillSearchForm() {
    const { query, type } = getUrlParameters();

    if (query) {
        const searchInput = document.getElementById("searchQuery");
        if (searchInput) {
            searchInput.value = decodeURIComponent(query);
        }
    }

    if (type && (type === "name" || type === "system")) {
        const searchTypeSelect = document.getElementById("searchType");
        if (searchTypeSelect) {
            searchTypeSelect.value = type;
        }
    }

    // Auto-perform search if both parameters are present
    if (query && type) {
        performSearch(decodeURIComponent(query));
    }
}

/**
 * Performs two API calls concurrently:
 *   1. Incident search (detailed stamped mail results)
 *   2. Aggregated totals (all time totals) from a different URL.
 */
async function performSearch(query) {
    const searchType = document.getElementById("searchType").value;
    const resultsContainer = document.getElementById("results-container");
    const totalsCardContainer = document.getElementById("totals-card");

    resultsContainer.innerHTML = '<p data-translate="search.loading">Loading...</p>';
    totalsCardContainer.innerHTML = "";

    try {
        const [incidentData, totalsData] = await Promise.all([
            searchIncidents(query, searchType),
            searchTotals(query, searchType),
        ]);

        displayAggregateCard(totalsData, searchType);
        displaySearchResults(incidentData);
    } catch (error) {
        console.error("Error fetching search data:", error);
        resultsContainer.innerHTML = `<p data-translate="search.error">Error loading search results.</p>`;
    }

    // Re-apply translations to new dynamic content
    if (typeof setLanguage === "function") {
        const currentLang = localStorage.getItem("preferredLanguage") || "en";
        setLanguage(currentLang);
    }
}

/**
 * Display the search results using createIncidentCard from utils.js.
 */
function displaySearchResults(data) {
    const container = document.getElementById("results-container");
    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = `<p data-translate="search.noResults">No results found.</p>`;
        return;
    }

    data.forEach((item) => {
        const card = createIncidentCard(item);
        if (card) {
            container.appendChild(card);
        }
    });

    if (typeof addIncidentCardListeners === "function") {
        addIncidentCardListeners();
    }
}

/**
 * Initialize search page functionality
 */
export function initializeSearchPage() {
    const searchButton = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchQuery");

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query === "") {
            alert("Please enter a search query.");
            return;
        }
        performSearch(query);
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            searchButton.click();
        }
    });

    prefillSearchForm();

    if (typeof setLanguage === "function") {
        const currentLang = localStorage.getItem("preferredLanguage") || "en";
        setLanguage(currentLang);
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    initializePage("search");
    initializeSearchPage();
}); 