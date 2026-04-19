/**
 * StockHub - No Dummy Data Policy
 */

const CONFIG = {
    PROXY: 'https://api.allorigins.win/get?url=',
    STOCK_API: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=',
    NEWS_RSS: 'https://fs.jtbc.co.kr/RSS/newsflash.xml',
    // 실제 데이터 심볼 리스트
    SYMBOLS: ['^KS11', '^KQ11', '^IXIC', '005930.KS', '000660.KS', '035720.KS', '035420.KS', '005380.KS']
};

// 에러 메시지 렌더링 함수 (가상 데이터 출력 금지)
function displayError(containerId, message, retryAction) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="status-msg fade-in">
            <p class="error-text">⚠️ ${message}</p>
            <span class="retry-link" onclick="${retryAction}">다시 시도</span>
        </div>
    `;
}

// 1. 실시간 주식 및 지수 데이터 가져오기
async function getMarketData() {
    try {
        const targetUrl = `${CONFIG.STOCK_API}${CONFIG.SYMBOLS.join(',')}`;
        const response = await fetch(`${CONFIG.PROXY}${encodeURIComponent(targetUrl)}`);
        
        if (!response.ok) throw new Error();
        
        const raw = await response.json();
        const data = JSON.parse(raw.contents).quoteResponse.result;

        if (!data || data.length === 0) throw new Error();

        renderIndices(data.filter(s => s.symbol.startsWith('^')));
        renderRankings(data.filter(s => !s.symbol.startsWith('^')));
    } catch (err) {
        displayError('index-cards', '지수 데이터를 가져오지 못했습니다.', 'getMarketData()');
        displayError('ranking-list', '종목 데이터를 가져오지 못했습니다.', 'getMarketData()');
    }
}

// 2. 실시간 뉴스 데이터 가져오기
async function getNewsData() {
    try {
        const response = await fetch(`${CONFIG.PROXY}${encodeURIComponent(CONFIG.NEWS_RSS)}`);
        const raw = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(raw.contents, "text/xml");
        const items = xml.querySelectorAll("item");

        if (!items || items.length === 0) throw new Error();

        renderNews(Array.from(items).slice(0, 4));
    } catch (err) {
        displayError('news-container', '최신 뉴스를 연결할 수 없습니다.', 'getNewsData()');
    }
}

function renderIndices(items) {
    const container = document.getElementById('index-cards');
    container.innerHTML = items.map(item => {
        const name = item.symbol === '^KS11' ? '코스피' : item.symbol === '^KQ11' ? '코스닥' : '나스닥';
        const up = item.regularMarketChangePercent >= 0;
        return `
            <div class="min-w-[160px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm fade-in">
                <p class="text-xs font-bold text-gray-400">${name}</p>
                <p class="text-lg font-black mt-1">${item.regularMarketPrice.toLocaleString()}</p>
                <p class="text-xs font-bold ${up ? 'text-red-500' : 'text-blue-500'}">
                    ${up ? '+' : ''}${item.regularMarketChangePercent.toFixed(2)}%
                </p>
            </div>
        `;
    }).join('');
}

function renderRankings(items) {
    const container = document.getElementById('ranking-list');
    container.innerHTML = items.map((item, idx) => {
        const up = item.regularMarketChangePercent >= 0;
        return `
            <div class="flex items-center justify-between p-1 cursor-pointer fade-in" onclick="window.open('https://finance.yahoo.com/quote/${item.symbol}')">
                <div class="flex items-center gap-3">
                    <span class="text-blue-500 font-bold w-4 text-sm">${idx + 1}</span>
                    <span class="font-bold text-[15px]">${item.shortName || item.symbol}</span>
                </div>
                <div class="text-right">
                    <p class="text-sm font-bold">${item.regularMarketPrice.toLocaleString()}원</p>
                    <p class="text-[11px] font-bold ${up ? 'text-red-500' : 'text-blue-500'}">${up ? '+' : ''}${item.regularMarketChangePercent.toFixed(2)}%</p>
                </div>
            </div>
        `;
    }).join('');
}

function renderNews(items) {
    const container = document.getElementById('news-container');
    container.innerHTML = items.map(item => `
        <div onclick="window.open('${item.querySelector("link").textContent}', '_blank')" class="p-4 bg-white rounded-2xl border border-gray-100 active:scale-95 transition-all cursor-pointer fade-in">
            <h4 class="text-sm font-bold line-clamp-2">${item.querySelector("title").textContent}</h4>
            <p class="text-[11px] text-gray-400 mt-2">${new Date(item.querySelector("pubDate").textContent).toLocaleTimeString()}</p>
        </div>
    `).join('');
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    getMarketData();
    getNewsData();
    
    // 60초마다 실제 데이터 갱신
    setInterval(() => {
        getMarketData();
        getNewsData();
    }, 60000);
});
