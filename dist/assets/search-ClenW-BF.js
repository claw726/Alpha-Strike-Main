import{k as g,i as v,m as y,n as f,c as C,h as p}from"./api-DC3DZFt0.js";function E(e){const t=e.total_losses>0?(e.total_kills/e.total_losses).toFixed(2):e.total_kills||0,a=(e.total_kills||0)+(e.total_losses||0),n=a>0?((e.total_kills||0)/a*100).toFixed(1):0;return{killDeathRatio:t,totalEngagements:a,winRate:n}}function L(e,t){const a=document.createElement("div");a.className="card-header";const n=document.createElement("div");n.className="profile-section";const s=document.createElement("div");s.className="profile-image-container";const c=document.createElement("img");c.className="profile-image",c.alt=`${e.name}'s profile`,c.src=e.image||"../assets/images/default-avatar.avif",s.appendChild(c);const r=document.createElement("div");r.className="profile-info";const i=document.createElement("h2");i.className="player-name",i.textContent=e.name;const l=document.createElement("p");l.className="player-status",l.textContent=e.status||"Unknown Status",r.appendChild(i),r.appendChild(l),n.appendChild(s),n.appendChild(r);const d=document.createElement("div");d.className="header-stats";const o=document.createElement("div");o.className="header-stat",o.innerHTML=`
        <div class="header-stat-value ${t.killDeathRatio>1?"killer":"victim"}">${t.killDeathRatio}</div>
        <div class="header-stat-label">K/D Ratio</div>
    `;const m=document.createElement("div");m.className="header-stat",m.innerHTML=`
        <div class="header-stat-value">${t.winRate}%</div>
        <div class="header-stat-label">Win Rate</div>
    `;const u=document.createElement("div");return u.className="header-stat",u.innerHTML=`
        <div class="header-stat-value">${t.totalEngagements}</div>
        <div class="header-stat-label">Engagements</div>
    `,d.appendChild(o),d.appendChild(m),d.appendChild(u),a.appendChild(n),a.appendChild(d),a}function N(e){const t=document.createElement("div");t.className="stats-grid";const a=document.createElement("div");a.className="stat-item secondary",a.innerHTML=`
        <div class="stat-icon"><i class="fas fa-percentage"></i></div>
        <div class="stat-content">
            <span class="stat-value">${e.winRate}%</span>
            <span class="stat-label" data-translate="card.winRate">Win Rate</span>
        </div>
    `;const n=document.createElement("div");return n.className="stat-item secondary",n.innerHTML=`
        <div class="stat-icon"><i class="fas fa-fire"></i></div>
        <div class="stat-content">
            <span class="stat-value">${e.totalEngagements}</span>
            <span class="stat-label" data-translate="card.totalEngagements">Total Engagements</span>
        </div>
    `,t.appendChild(a),t.appendChild(n),t}function I(e){const t=e.incident_count&&e.days_active?(e.incident_count/e.days_active).toFixed(1):"< 1",a=e.incident_count>100?"HIGH":e.incident_count>50?"MEDIUM":"LOW";return{avgIncidentsPerDay:t,threatLevel:a,threatClass:a==="HIGH"?"threat-high":a==="MEDIUM"?"threat-medium":"threat-low"}}function S(e,t){const a=document.createElement("div");a.className="card-header";const n=document.createElement("div");n.className="system-section";const s=document.createElement("div");s.className="system-image-container";const c=document.createElement("img");c.className="system-image",c.alt=`${e.name} system`,c.dataset.src=e.image||"/images/default-system.png",s.appendChild(c);const r=document.createElement("div");r.className="system-info";const i=document.createElement("h2");i.className="system-name",i.textContent=e.name;const l=document.createElement("p");l.className="system-region",l.textContent=e.region||"Unknown Region",r.appendChild(i),r.appendChild(l),n.appendChild(s),n.appendChild(r);const d=document.createElement("div");d.className="header-stats";const o=document.createElement("div");o.className="header-stat",o.innerHTML=`
        <div class="header-stat-value threat-${t.threatLevel.toLowerCase()}">${t.totalIncidents}</div>
        <div class="header-stat-label">Incidents</div>
    `;const m=document.createElement("div");m.className="header-stat",m.innerHTML=`
        <div class="header-stat-value">${t.avgIncidentsPerDay.toFixed(1)}</div>
        <div class="header-stat-label">Per Day</div>
    `;const u=document.createElement("div");return u.className="header-stat",u.innerHTML=`
        <div class="header-stat-value">${t.activeDays}</div>
        <div class="header-stat-label">Active Days</div>
    `,d.appendChild(o),d.appendChild(m),d.appendChild(u),a.appendChild(n),a.appendChild(d),a}function H(e){const t=document.createElement("div");t.className="stats-grid";const a=document.createElement("div");return a.className="stat-item secondary",a.innerHTML=`
        <div class="stat-icon"><i class="fas fa-clock"></i></div>
        <div class="stat-content">
            <span class="stat-value">${e.days_active||"N/A"}</span>
            <span class="stat-label" data-translate="card.activeDays">Active Days</span>
        </div>
    `,t.appendChild(a),t}function T(e){const t=document.createElement("div");t.className="data-card enhanced-player-card",t.dataset.id=e.id;const a=E(e),n=L(e,a),s=N(a);return t.appendChild(n),t.appendChild(s),t}function M(e){const t=document.createElement("div");t.className="data-card enhanced-system-card",t.dataset.id=e.id;const a=I(e),n=S(e,a),s=H(e);t.appendChild(n),t.appendChild(s);const c=t.querySelector(".system-image");return c&&g.addLazyLoading(c),t}function D(e,t){const a=document.getElementById("totals-card");if(a.innerHTML="",!e||e.length===0){a.innerHTML='<p data-translate="search.noAggregatedData">No aggregated data found.</p>';return}const n=e[0],s=t==="name"?T(n):M(n);a.appendChild(s)}function R(){const e=new URLSearchParams(window.location.search);return{query:e.get("query"),type:e.get("type")}}function k(){const{query:e,type:t}=R();if(e){const a=document.getElementById("searchQuery");a&&(a.value=decodeURIComponent(e))}if(t&&(t==="name"||t==="system")){const a=document.getElementById("searchType");a&&(a.value=t)}e&&t&&h(decodeURIComponent(e))}async function h(e){const t=document.getElementById("searchType").value,a=document.getElementById("results-container"),n=document.getElementById("totals-card");a.innerHTML='<p data-translate="search.loading">Loading...</p>',n.innerHTML="";try{const[s,c]=await Promise.all([y(e,t),f(e,t)]);D(c,t),P(s)}catch(s){console.error("Error fetching search data:",s),a.innerHTML='<p data-translate="search.error">Error loading search results.</p>'}if(typeof setLanguage=="function"){const s=localStorage.getItem("preferredLanguage")||"en";setLanguage(s)}}function P(e){const t=document.getElementById("results-container");if(t.innerHTML="",!e||e.length===0){t.innerHTML='<p data-translate="search.noResults">No results found.</p>';return}e.forEach(a=>{const n=C(a);n&&t.appendChild(n)}),typeof p=="function"&&p()}function w(){const e=document.getElementById("searchBtn"),t=document.getElementById("searchQuery");if(e.addEventListener("click",()=>{const a=t.value.trim();if(a===""){alert("Please enter a search query.");return}h(a)}),t.addEventListener("keypress",a=>{a.key==="Enter"&&e.click()}),k(),typeof setLanguage=="function"){const a=localStorage.getItem("preferredLanguage")||"en";setLanguage(a)}}document.addEventListener("DOMContentLoaded",()=>{v("search"),w()});
