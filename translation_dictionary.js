// Translation dictionary for selected elements.
// Translation dictionary for selected elements.
const translations = {
      	"navbar.home": { 
        	en: "Recently Stamped", 
        	ru: "Недавно Отмечено", 
        	zh: "最近盖章", 
       	 	es: "Recientemente Sellado" 
      	},
      	"navbar.killers": { 
        	en: "Leading Killers", 
        	ru: "Лидирующие Убийцы", 
        	zh: "领先杀手", 
        	es: "Principales Asesinos" 
      	},
      	"navbar.systems": { 
        	en: "Leading Systems", 
        	ru: "Лидирующие Системы", 
        	zh: "领先系统", 
        	es: "Principales Sistemas" 
      	},
      	"navbar.victims": { 
        	en: "Leading Victims", 
        	ru: "Лидирующие Жертвы", 
        	zh: "领先受害者", 
        	es: "Principales Víctimas" 
      	},
      	"navbar.search": { 
        	en: "Search", 
        	ru: "Поиск", 
        	zh: "搜索", 
        	es: "Buscar" 
      	},
	// Headers:
      	"page.search-header": { 
        	en: "Search Stamped Mails", 
        	ru: "Поиск Отмеченных Писем", 
        	zh: "搜索盖章邮件", 
        	es: "Buscar Correos Sellados" 
      	},
	"page.stamped-header": {
		en: "Recently Stamped Mails",
		ru: "Недавно Запечатленные Письма",
		zh: "最近盖章邮件",
		es: "Correos Sellados Recientemente" 
	},
	// Totals and labels:
      	"header.tenaciousKillers": {
		en: "Tenacious Killers",
		ru: "Упорные Убийцы",
		zh: "顽强杀手",
		es: "Asesinos Tenaces"
	},
      	"table.name": {
		en: "Name",
		ru: "Имя",
		zh: "姓名",
		es: "Nombre"
	},
      	"table.numVictimsStacked": {
		en: "Number of Victims Stacked",
		ru: "Количество накопленных жертв",
		zh: "堆叠的受害者数量",
		es: "Número de Víctimas Acumuladas" },
      	"header.defeatedVictims": {
		en: "Defeated Victims",
		ru: "Побеждённые Жертвы",
	        zh: "被击败的受害者",
		es: "Víctimas Derrotadas"
	},
     	"table.numAwakenings": {
	 	en: "Number of Awakenings",
		ru: "Количество Пробуждений",
	    	zh: "觉醒次数",
	        es: "Número de Despertares"
	},
	"header.leadingSystemsByIncidents": {
 		en: "Leading Systems by Incidents",
		ru: "Ведущие Системы по Инцидентам",
		zh: "基于事件的领先系统",
	 	es: "Sistemas Líderes por Incidentes"
	},
	"table.numIncidents": {
	 	en: "Number of Incidents",
		ru: "Количество Инцидентов",
		zh: "事件数量",
		es: "Número de Incidentes"
	},
  	"header.rollingMonthly": { 
    		en: "Rolling Monthly Average", 
    		ru: "Скользящее среднее за месяц", 
    		zh: "滚动月平均", 
    		es: "Promedio Mensual Móvil"
	},
	// Search functions:
      	"search.byName": { 
        	en: "Search by Name", 
        	ru: "Поиск по имени", 
        	zh: "按名称搜索", 
        	es: "Buscar por Nombre" 
      	},
      	"search.bySystem": { 
        	en: "Search by System", 
        	ru: "Поиск по системе", 
        	zh: "按系统搜索", 
        	es: "Buscar por Sistema" 
      	},
      	"search.placeholder": { 
        	en: "Enter search query...", 
        	ru: "Введите запрос...", 
        	zh: "输入搜索内容...", 
        	es: "Introduzca la consulta..." 
      	},
      	"search.button": { 
        	en: "Search", 
        	ru: "Поиск", 
        	zh: "搜索", 
        	es: "Buscar" 
      	},
      	"search-results.header": { 
        	en: "Search Results", 
        	ru: "Результаты поиска", 
        	zh: "搜索结果", 
        	es: "Resultados de la Búsqueda" 
      	},
	// Search errors:
	"search.error": {
		en: "Error fetching search results. Please check your query.", 
                ru: "Ошибка при получении результатов поиска. Пожалуйста, проверьте запрос.", 
                zh: "获取搜索结果时出错。请检查您的查询。", 
                es: "Error al obtener los resultados de búsqueda. Por favor, revise su consulta."
	},
      	// Keys for card labels:
      	"card.lossType": { 
        	en: "Loss Type:", 
        	ru: "Тип потерь:", 
        	zh: "损失类型:", 
        	es: "Tipo de Pérdida:" 
      	},
      	"card.solarSystem": { 
        	en: "Solar System:", 
        	ru: "Солнечная система:", 
        	zh: "太阳系:", 
        	es: "Sistema Solar:" 
      	},
      	"card.timestamp": { 
        	en: "Timestamp:", 
        	ru: "Время:", 
        	zh: "时间戳:", 
        	es: "Marca de Tiempo:" 
      	},
  	"card.totalVictims": {
    		en: "Total Victims:",
    		ru: "Общее число жертв:",
    		zh: "总受害者:",
    		es: "Total de víctimas:"
  	},
  	"card.totalAwakenings": {
    		en: "Total Awakenings:",
    		ru: "Всего пробуждений:",
    		zh: "总觉醒数:",
    		es: "Total de despertares:"
  	},
  	"card.solarSystemID": {
    		en: "Solar System ID:",
    		ru: "ID звездной системы:",
    		zh: "太阳系编号:",
    		es: "ID del sistema solar:"
  	},
  	"card.incidentCount": {
    		en: "Incident Count:",
    		ru: "Количество инцидентов:",
    		zh: "事件数量:",
    		es: "Cantidad de incidentes:"
  	}
      	// Extend further as needed...
};
// Set language function.
function setLanguage(lang) {
      	localStorage.setItem("preferredLanguage", lang);
      	console.log("Setting language to", lang);
     	// Translate elements.
      	const translatableElements = document.querySelectorAll("[data-translate]");
      	translatableElements.forEach(el => {
        	const key = el.getAttribute("data-translate");
        	if (translations[key] && translations[key][lang]) {
        		el.innerText = translations[key][lang];
        	}
      	});
      	// Translate attributes
      	const translatablePlaceholders = document.querySelectorAll("[data-translate-placeholder]");
      	translatablePlaceholders.forEach(el => {
        const key = el.getAttribute("data-translate-placeholder");
        	if (translations[key] && translations[key][lang]) {
          		el.placeholder = translations[key][lang];
        	}
      	});
    }
// Document function for lanuage preference.
document.addEventListener("DOMContentLoaded", () => {
      	// Set saved language or default to English
      	const savedLang = localStorage.getItem("preferredLanguage") || "en";
      	setLanguage(savedLang);
      	// Animated language switcher code:
      	const languages = ['en', 'es', 'ru', 'zh'];
      	// Initialize currentIndex to the index of savedLang, or 0 if not found.
      	let currentIndex = languages.indexOf(savedLang);
      	if (currentIndex === -1) currentIndex = 0;
      	const animatedBtn = document.getElementById('animatedLangBtn');
      	animatedBtn.innerText = languages[currentIndex].toUpperCase();
      	// Function to cycle the button text without affecting page translation.
      	function cycleLanguage() {
        	// Fade out the text
        	animatedBtn.style.opacity = '0';
        	setTimeout(() => {
          		currentIndex = (currentIndex + 1) % languages.length;
          		animatedBtn.innerText = languages[currentIndex].toUpperCase();
          		animatedBtn.style.opacity = '1';
          		console.log("Cycling language, now:", languages[currentIndex]);
        	}, 500); // 500ms for fade effect
      	}
      	// Start cycling languages every few seconds.
	let cycleInterval = setInterval(cycleLanguage, 3000);
      	// When the button is clicked, set the selected language but do not clear the cycle.
      	animatedBtn.addEventListener('click', () => {
        	const selectedLang = languages[currentIndex];
        	setLanguage(selectedLang);
        	console.log("Language selected:", selectedLang);
        	// The animation continues even after clicking.
      	});
});
