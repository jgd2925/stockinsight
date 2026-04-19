/**
 * StockHub Real-Time Data Script
 */

const CONFIG = {
    // CORS 보안 우회를 위한 프록시
    PROXY: 'https://api.allorigins.win/get?url=',
    // 주가 정보 API (Yahoo Finance)
    STOCK_API: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=',
    // 뉴스 RSS (JTBC 실시간 뉴스)
    NEWS_RSS: 'https://fs.jtbc.co.kr/RSS/newsflash.xml',
    // 추적할 심볼 (지수 및 주요 종목)
    SYMBOLS: ['^KS11', '^KQ11', '^IXIC', '005930.KS', '000660.KS', '035720.KS', '035420.KS', '005380.KS']
};

// 1. 시장 데이터(지수 및 주가) 호출
async function fetchMarketData() {
    try {
        const targetUrl = `${CONFIG.STOCK_API}${CONFIG.SYMBOLS.join(',')}`;
        const response = await fetch(`${CONFIG.PROXY}${encodeURIComponent(targetUrl)}`);
        const rawData = await response.json();
        const data = JSON.parse(rawData.contents).quoteResponse.result;

        const indices = data.filter(s => s.symbol.startsWith('^'));
        const stocks = data.filter(s => !s.symbol.startsWith('^'));

        renderIndices(indices);
        renderRankings(stocks);
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

// 2. 실시간 뉴스 호출
async function fetchNews() {
    try {
        const response = await fetch(`${CONFIG.PROXY}${encodeURIComponent(CONFIG.NEWS_RSS)}`);
        const rawData = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rawData.contents, "text/xml");
        const items = Array.from(xmlDoc.querySelectorAll("item")).slice(0, 4);

        const container = document.getElementById('news-container');
        container.innerHTML = items.map(item => `
            <div onclick="window.open('${item.querySelector("link").textContent}', '_blank')" 
                 class="p-4 bg-white rounded-2xl border border-gray-50 shadow-sm active-scale cursor-pointer fade-in">
                <span class="text-[#3182F6] text-[10px] font-bold">실시간 뉴스</span>
                <h4 class="text-sm font-bold mt-1 line-clamp-2">${item.querySelector("title").textContent}</h4>
                <p class="text-[11px] text-gray-400 mt-2">${new Date(item.querySelector("pubDate").textContent).toLocaleTimeString()}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error("뉴스 로드 실패:", error);
    }
}

// 3. 지수 카드 렌더링
function renderIndices(data) {
    const container = document.getElementById('index-cards');
    container.innerHTML = data.map(item => {
        const name = item.symbol === '^KS11' ? '코스피' : item.symbol === '^KQ11' ? '코스닥' : '나스닥';
        const isUp = item.regularMarketChangePercent >= 0;
        return `
            <div class="min-w-[160px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm fade-in">
                <p class="text-xs font-bold text-gray-400">${name}</p>
                <p class="text-lg font-black mt-1">${item.regularMarketPrice.toLocaleString()}</p>
                <p class="text-xs font-bold ${isUp ? 'text-red-500' : 'text-blue-500'}">
                    ${isUp ? '+' : ''}${item.regularMarketChangePercent.toFixed(2)}% ${isUp ? '▲' : '▼'}
                </p>
            </div>
        `;
    }).join('');
}

// 4. 종목 랭킹 렌더링
function renderRankings(data) {
    const container = document.getElementById('ranking-list');
    container.innerHTML = data.map((item, idx) => {
        const isUp = item.regularMarketChangePercent >= 0;
        return `
            <div class="flex items-center justify-between p-1 active-scale cursor-pointer fade-in" 
                 onclick="window.open('https://finance.yahoo.com/quote/${item.symbol}', '_blank')">
                <div class="flex items-center gap-3">
                    <span class="text-blue-500 font-bold w-4 text-sm">${idx + 1}</span>
                    <span class="font-bold text-[15px]">${item.shortName || item.symbol.split('.')[0]}</span>
                </div>
                <div class="text-right">
                    <p class="text-sm font-bold">${item.regularMarketPrice.toLocaleString()}원</p>
                    <p class="text-[11px] font-bold ${isUp ? 'text-red-500' : 'text-blue-500'}">
                        ${isUp ? '+' : ''}${item.regularMarketChangePercent.toFixed(2)}%
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

// 5. 검색창 기능
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.value) {
            window.open(`https://finance.yahoo.com/quote/${e.target.value}`, '_blank');
        }
    });
}

// 6. 초기화 및 루프
document.addEventListener('DOMContentLoaded', () => {
    fetchMarketData();
    fetchNews();

    // 30초마다 데이터 갱신
    setInterval(() => {
        fetchMarketData();
        fetchNews();
    }, 30000);
});
