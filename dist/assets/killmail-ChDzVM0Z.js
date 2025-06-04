import{l as y,i as L,a as d,s as p,b as v,t as g,e as b,g as w,h as k,j as N}from"./api-DC3DZFt0.js";let n=null;const l=(e,i="",s={})=>{var t,o;const r=d[N];let a=((t=g[e])==null?void 0:t[r])||((o=g[e])==null?void 0:o.en)||i||e;for(const m in s)a=a.replace(new RegExp(`{${m}}`,"g"),s[m]);return a},c=(e,i)=>e==null||typeof e=="string"&&e.trim()===""?l(`general.${i.toLowerCase()}`,i):String(e);function $(e){const i=document.getElementById("killmail-content"),s=document.getElementById("killmail-page-title-container"),r=document.querySelector("title");if(!i||!s||!r){console.error("One or more essential DOM elements for killmail detail page are missing."),i&&(i.innerHTML=`<p class="error">${l("error.generic","An error occurred.")}</p>`);return}if(!e){i.innerHTML=`<p class="error">${l("error.killmailLoadFailed","Killmail data is not available to render.")}</p>`;return}const a=c(e.victim_name,"unknown"),t=c(e.killer_name,"notApplicable"),o=c(e.solar_system_name,"unknown"),m=c(e.loss_type,"classified"),u=c(e.solar_system_id,"notApplicable");r.textContent=l("killmail.pageTitlePattern","Killmail: {killerName} vs {victimName}",{killerName:t,victimName:a}),s.innerHTML=`
        <h1>
            <span class="killer clickable-name" data-name="${t}" title="${l("tooltip.searchFor","Search for {itemName}",{itemName:t})}">${t}</span>
            <span class="text-primary">${l("killmail.headerVs","vs")}</span>
            <span class="victim clickable-name" data-name="${a}" title="${l("tooltip.searchFor","Search for {itemName}",{itemName:a})}">${a}</span>
        </h1>
        <p class="system-location">
            ${l("killmail.headerIncidentIn","Incident in")}
            <span class="clickable-system" data-system="${o}" title="${l("tooltip.searchFor","Search for {itemName}",{itemName:o})}">${o}</span>
        </p>
    `;const h="../assets/images/default-avatar.avif",I=e.loss_type==="ship"||e.loss_type==="pod"?m:l("killmail.placeholder.victimShip","[Ship Placeholder]"),S=`
    <div class="combatants-grid-km">
        <div class="combatant-column-km killer-column">
             <div class="combatant-card-km killer-card-km">
                <div class="combatant-header-km">
                    <img src="${h}" alt="${l("altText.killerImage","Killer {killerName}",{killerName:t})}" class="profile-image">
                    <div class="combatant-info-km">
                        <h3 class="combatant-role-label killer">${l("killmail.killerLabel","KILLER")}</h3>
                        <h2 class="killer clickable-name" data-name="${t}" title="${l("tooltip.searchFor","Search for {itemName}",{itemName:t})}">${t}</h2>
                        <p>${l("killmail.corporationLabel","Corporation:")} <span class="placeholder">${l("killmail.placeholder.killerCorp","[Killer Corp Placeholder]")}</span></p>
                        <p>${l("killmail.shipLabel","Ship:")} <span class="placeholder">${l("killmail.placeholder.killerShip","[Killer Ship Placeholder]")}</span></p>
                    </div>
                </div>
            </div>
        </div>

        <div class="combatant-column-km victim-column">
            <div class="combatant-card-km victim-card-km">
                <div class="combatant-header-km">
                    <img src="${h}" alt="${l("altText.victimImage","Victim {victimName}",{victimName:a})}" class="profile-image">
                    <div class="combatant-info-km">
                        <h3 class="combatant-role-label victim">${l("killmail.victimLabel","VICTIM")}</h3>
                        <h2 class="victim clickable-name" data-name="${a}" title="${l("tooltip.searchFor","Search for {itemName}",{itemName:a})}">${a}</h2>
                        <p>${l("killmail.corporationLabel","Corporation:")} <span class="placeholder">${l("killmail.placeholder.victimCorp","[Victim Corp Placeholder]")}</span></p>
                        <p>${l("killmail.shipLabel","Ship:")} <span class="placeholder">${I}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="engagement-details-km data-card">
        <h3>${l("killmail.engagementDetailsTitle","Engagement Details")}</h3>
        <p><strong>${l("killmail.lossTypeLabel","Loss Type:")}</strong> ${m}</p>
        <p><strong>${l("killmail.timeLabel","Time:")}</strong> ${b(e.time_stamp,w)}</p>
        <p><strong>${l("killmail.locationLabel","Location:")}</strong> <span class="clickable-system" data-system="${o}" title="${l("tooltip.searchFor","Search for {itemName}",{itemName:o})}">${o}</span> (${l("card.idLabel","ID:")} ${u})</p>
    </div>

    <div class="fitting-section-km data-card">
        <h3>${l("killmail.fittingTitle","Ship Fitting & Contents")}</h3>
        <p class="note">
            <i class="fas fa-info-circle"></i> ${l("killmail.fittingNote","Note: Fitting data is placeholder.")}
        </p>
        <div class="fitting-table-km">
            <details class="fitting-category" open>
                <summary><i class="fas fa-crosshairs"></i> ${l("killmail.fitting.highSlots","High Slots")}</summary>
                <ul>
                    <li><span class="placeholder">${l("killmail.placeholder.highSlotItem1","[High Slot Item 1]")}</span> <span class="placeholder">${l("killmail.placeholder.highSlotAmmo1","[Ammo]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.highSlotItem1","[High Slot Item 1]")}</span> <span class="placeholder">${l("killmail.placeholder.highSlotAmmo1","[Ammo]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.highSlotItem2","[High Slot Item 2]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.emptyHighSlot","[Empty High Slot]")}</span></li>
                </ul>
            </details>
            <details class="fitting-category" open>
                <summary><i class="fas fa-shield-alt"></i> ${l("killmail.fitting.midSlots","Mid Slots")}</summary>
                <ul>
                    <li><span class="placeholder">${l("killmail.placeholder.midSlotItem1","[Mid Slot Item 1]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.midSlotItem2","[Mid Slot Item 2]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.midSlotItem3","[Mid Slot Item 3]")}</span></li>
                </ul>
            </details>
            <details class="fitting-category" open>
                <summary><i class="fas fa-cogs"></i> ${l("killmail.fitting.lowSlots","Low Slots")}</summary>
                <ul>
                    <li><span class="placeholder">${l("killmail.placeholder.lowSlotItem1","[Low Slot Item 1]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.lowSlotItem2","[Low Slot Item 2]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.lowSlotItem3","[Low Slot Item 3]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.lowSlotItem3","[Low Slot Item 3]")}</span></li>
                </ul>
            </details>
            <details class="fitting-category" open>
                <summary><i class="fas fa-microchip"></i> ${l("killmail.fitting.rigs","Rigs")}</summary>
                <ul>
                    <li><span class="placeholder">${l("killmail.placeholder.rigSlotItem1","[Rig Slot Item 1]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.rigSlotItem2","[Rig Slot Item 2]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.rigSlotItem3","[Rig Slot Item 3]")}</span></li>
                </ul>
            </details>
            <details class="fitting-category" open>
                <summary><i class="fas fa-fighter-jet"></i> ${l("killmail.fitting.drones","Drones")}</summary>
                <ul>
                    <li><span class="placeholder">${l("killmail.placeholder.droneItem1","[Drone Item 1]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.droneItem2","[Drone Item 2]")}</span></li>
                </ul>
            </details>
             <details class="fitting-category" open>
                <summary><i class="fas fa-cubes"></i> ${l("killmail.fitting.ammoCharges","Ammunition / Charges")}</summary>
                <ul>
                    <li><span class="placeholder">${l("killmail.placeholder.ammoItem1","[Ammo Item 1]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.ammoItem2","[Ammo Item 2]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.ammoItem3","[Ammo Item 3]")}</span></li>
                </ul>
            </details>
            <details class="fitting-category" open>
                <summary><i class="fas fa-box-open"></i> ${l("killmail.fitting.cargoHold","Cargo Hold")}</summary>
                <ul>
                    <li><span class="placeholder">${l("killmail.placeholder.cargoItem1","[Cargo Item 1]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.cargoItem2","[Cargo Item 2]")}</span></li>
                    <li><span class="placeholder">${l("killmail.placeholder.cargoItem3","[Cargo Item 3]")}</span></li>
                </ul>
            </details>
        </div>
    </div>
    `;i.innerHTML=S,typeof k=="function"&&k()}async function f(){const i=new URLSearchParams(window.location.search).get("mail_id"),s=document.getElementById("killmail-content");if(!s){console.error("killmail-content element not found in DOM.");return}if(i)try{if(!n){s.innerHTML=`<p data-translate="loading.killmail">${l("loading.killmail","Loading killmail data...")}</p>`;const a=localStorage.getItem("preferredLanguage")||d[0];typeof p=="function"&&p(a)}if(!n||n.id!==Number.parseInt(i)){const a=await v(i);if(!a||a.length===0)throw new Error(l("error.killmailNotFound","Killmail not found."));n=a[0]}$(n)}catch(a){console.error("Failed to load killmail data from API:",a),n=null,s.innerHTML=`<p class="error">${l("error.killmailLoadFailedApi",a.message||"Failed to load killmail data from API.")}</p>`}else n=null,s.innerHTML=`<p class="error">${l("error.noKillmailId","No killmail ID provided in URL.")}</p>`;const r=localStorage.getItem("preferredLanguage")||d[0];typeof p=="function"&&p(r)}document.addEventListener("DOMContentLoaded",async()=>{await y(),L("killmail_detail"),await f(),typeof window.AlphaStrike>"u"&&(window.AlphaStrike={}),window.AlphaStrike.onLanguageChangeRenderContent=()=>{console.log("Killmail page: Language change detected, re-rendering content."),n?$(n):f()}});
