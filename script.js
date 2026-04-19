/**
 * StockHub Real-Time Data Engine
 */

// 1. 상태 및 구성
const CONFIG = {
    PROXY: 'https://api.allorigins.win/get?url=',
    STOCKS_API: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=',
    NEWS_RSS: 'https://fs.jtbc.co.kr/RSS/newsflash.xml', // 실시간 뉴스 피드
    SYMBOLS: ['^KS11', '^KQ11', '^IXIC', '005930.KS', '000660.KS', '035720.KS', '035420.KS', '005380.KS']
};

// 2. 실시간 지수 및 종목 정보 호출
async function fetchMarketData() {
    const targetUrl = `${CONFIG.STOCKS_API}${CONFIG.SYMBOLS.join(',')}`;
    try {
        const response = await fetch(`${CONFIG.PROXY}${encodeURIComponent(targetUrl)}`);
        const data = await response.json();
        const results = JSON.parse(data.contents).quoteResponse.result;

        // 지수(Index)와 일반 종목(Stocks) 분리
        const indices = results.filter(item => item.symbol.startsWith('^'));
        const stocks = results.filter(item => !item.symbol.startsWith('^'));

        renderIndices(indices);
        renderRankings(stocks);
    } catch (e) {
        console.error("시장 데이터 호출 실패:", e);
    }
}

// 3. 실시간 뉴스 호출 (JTBC/경향 등 RSS 활용)
async function fetchRealTimeNews() {
    try {
        const response = await fetch(`${CONFIG.PROXY}${encodeURIComponent(CONFIG.NEWS_RSS)}`);
        const data = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const items = Array.from(xmlDoc.querySelectorAll("item")).slice(0, 5);

        const newsContainer = document.getElementById('theme-container'); // 뉴스 영역으로 활용
        if (!newsContainer) return;

        newsContainer.innerHTML = items.map(item => `
            <div onclick="window.open('${item.querySelector("link").textContent}', '_blank')" 
                 class="p-4 bg-white rounded-2xl border border-gray-50 shadow-sm active:scale-95 transition-all cursor-pointer">
                <p class="text-[#3182F6] text-[10px] font-bold mb-1">실시간 속보</p>
                <h4 class="text-sm font-bold line-clamp-2">${item.querySelector("title").textContent}</h4>
                <p class="text-[11px] text-gray-400 mt-2">${new Date(item.querySelector("pubDate").textContent).toLocaleTimeString()}</p>
            </div>
        `).join('');
    } catch (e) {
        console.error("뉴스 호출 실패:", e);
    }
}

// 4. 화면 렌더링 함수들
function renderIndices(data) {
    const container = document.getElementById('index-cards');
    container.innerHTML = data.map(item => {
        const name = item.symbol === '^KS11' ? '코스피' : item.symbol === '^KQ11' ? '코스닥' : '나스닥';
        const isUp = item.regularMarketChangePercent >= 0;
        return `
            <div class="min-w-[160px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p class="text-xs font-bold text-gray-400">${name}</p>
                <p class="text-lg font-black mt-1">${item.regularMarketPrice.toLocaleString()}</p>
                <p class="text-xs font-bold ${isUp ? 'text-red-500' : 'text-blue-500'}">
                    ${isUp ? '+' : ''}${item.regularMarketChangePercent.toFixed(2)}% ${isUp ? '▲' : '▼'}
                </p>
            </div>
        `;
    }).join('');
}

function renderRankings(data) {
    const container = document.getElementById('ranking-list');
    container.innerHTML = data.map((item, idx) => {
        const isUp = item.regularMarketChangePercent >= 0;
        return `
            <div class="flex items-center justify-between p-1 active:scale-95 transition-all cursor-pointer" 
                 onclick="window.open('https://finance.yahoo.com/quote/${item.symbol}', '_blank')">
                <div class="flex items-center gap-3">
                    <span class="text-blue-500 font-bold w-4 text-sm">${idx + 1}</span>
                    <span class="font-bold text-[15px]">${item.shortName || item.symbol}</span>
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

// 5. 실행 제어
document.addEventListener('DOMContentLoaded', () => {
    // 최초 실행
    fetchMarketData();
    fetchRealTimeNews();

    // 실시간 업데이트 (30초 주기)
    setInterval(() => {
        fetchMarketData();
        fetchRealTimeNews();
    }, 30000);
});
