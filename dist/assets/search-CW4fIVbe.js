import{i as o,k as v,m as g,c as h,h as c}from"./api-D2AYUuxa.js";function m(){const t=new URLSearchParams(window.location.search);return{query:t.get("query"),type:t.get("type")}}function u(){const{query:t,type:s}=m();if(t){const e=document.getElementById("searchQuery");e&&(e.value=decodeURIComponent(t))}if(s&&(s==="name"||s==="system")){const e=document.getElementById("searchType");e&&(e.value=s)}t&&s&&l(decodeURIComponent(t))}async function l(t){const s=document.getElementById("searchType").value,e=document.getElementById("results-container"),a=document.getElementById("totals-card");e.innerHTML='<p data-translate="search.loading">Loading...</p>',a.innerHTML="";try{const[n,d]=await Promise.all([v(t,s),g(t,s)]);p(d,s),y(n)}catch(n){console.error("Error fetching search data:",n),localStorage.getItem("preferredLanguage"),e.innerHTML='<p data-translate="search.error">Error loading search results.</p>'}if(typeof setLanguage=="function"){const n=localStorage.getItem("preferredLanguage")||"en";setLanguage(n)}}function p(t,s){const e=document.getElementById("totals-card");if(e.innerHTML="",!t||t.length===0){e.innerHTML='<p data-translate="search.noAggregatedData">No aggregated data found.</p>';return}const a=t[0],n="../";if(s==="name"&&a){const d=a.total_losses>0?(a.total_kills/a.total_losses).toFixed(2):a.total_kills||0,i=(a.total_kills||0)+(a.total_losses||0),r=i>0?((a.total_kills||0)/i*100).toFixed(1):0;e.innerHTML=`
                    <div class="data-card search-total enhanced-player-card">
                        <div class="card-header">
                            <div class="profile-section">
                                <div class="profile-image-container">
                                    <img src="${n}assets/images/awakened.avif" alt="Player Profile" class="profile-image">
                                    <div class="profile-status-indicator"></div>
                                </div>
                                <div class="profile-info">
                                    <h2 class="player-name">${a.name}</h2>
                                    <span class="player-status" data-translate="card.combatPilot">Combat Pilot</span>
                                </div>
                            </div>
                            <div class="header-stats">
                                <div class="header-stat">
                                    <div class="header-stat-value killer">${a.total_kills||0}</div>
                                    <div class="header-stat-label" data-translate="card.totalVictims">Victims</div>
                                </div>
                                <div class="header-stat">
                                    <div class="header-stat-value victim">${a.total_losses||0}</div>
                                    <div class="header-stat-label" data-translate="card.totalAwakenings">Awakenings</div>
                                </div>
                                <div class="header-stat">
                                    <div class="header-stat-value">${d}</div>
                                    <div class="header-stat-label" data-translate="card.kdRatio">K/D Ratio</div>
                                </div>
                            </div>
                        </div>

                        <div class="stats-grid">
                            <div class="stat-item secondary">
                                <div class="stat-icon"><i class="fas fa-percentage"></i></div>
                                <div class="stat-content">
                                    <span class="stat-value">${r}%</span>
                                    <span class="stat-label" data-translate="card.winRate">Win Rate</span>
                                </div>
                            </div>

                            <div class="stat-item secondary">
                                <div class="stat-icon"><i class="fas fa-fire"></i></div>
                                <div class="stat-content">
                                    <span class="stat-value">${i}</span>
                                    <span class="stat-label" data-translate="card.totalEngagements">Total Engagements</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `}else if(s==="system"&&a){const d=a.incident_count&&a.days_active?(a.incident_count/a.days_active).toFixed(1):"< 1",i=a.incident_count>100?"HIGH":a.incident_count>50?"MEDIUM":"LOW",r=i==="HIGH"?"threat-high":i==="MEDIUM"?"threat-medium":"threat-low";e.innerHTML=`
                <div class="data-card search-total enhanced-system-card">
                    <div class="card-header">
                        <div class="system-section">
                            <div class="system-image-container">
                                <img src="https://images.evetech.net/types/3796/render" alt="Solar System" class="system-image">
                            </div>
                            <div class="system-info">
                                <h2 class="system-name">${a.solar_system_name||"Unknown System"}</h2>
                                <span class="system-region" data-translate="card.region">Region: Unknown</span>
                            </div>
                        </div>
                        <div class="header-stats">
                            <div class="header-stat">
                                <div class="header-stat-value">${a.incident_count||0}</div>
                                <div class="header-stat-label" data-translate="card.incidentCount">Incidents</div>
                            </div>
                            <div class="header-stat">
                                <div class="header-stat-value ${r}">${i}</div>
                                <div class="header-stat-label" data-translate="card.threatLevel">Threat Level</div>
                            </div>
                            <div class="header-stat">
                                <div class="header-stat-value">${d}</div>
                                <div class="header-stat-label" data-translate="card.avgPerDay">Avg/Day</div>
                            </div>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-item secondary">
                            <div class="stat-icon"><i class="fas fa-clock"></i></div>
                            <div class="stat-content">
                                <span class="stat-value">${a.days_active||"N/A"}</span>
                                <span class="stat-label" data-translate="card.activeDays">Active Days</span>
                            </div>
                        </div>
                    </div>
                </div>
                `}else e.innerHTML='<p data-translate="search.noAggregatedData">No aggregated data found for this type.</p>'}function y(t){const s=document.getElementById("results-container");if(s.innerHTML="",!t||t.length===0){s.innerHTML='<p data-translate="search.noResults">No results found.</p>';return}t.forEach(e=>{const a=h(e);a&&s.appendChild(a)}),typeof c=="function"&&c()}document.addEventListener("DOMContentLoaded",()=>{o("search");const t=document.getElementById("searchBtn"),s=document.getElementById("searchQuery");if(t.addEventListener("click",()=>{const e=s.value.trim();if(e===""){alert("Please enter a search query.");return}l(e)}),s.addEventListener("keypress",e=>{e.key==="Enter"&&t.click()}),u(),typeof setLanguage=="function"){const e=localStorage.getItem("preferredLanguage")||"en";setLanguage(e)}});
