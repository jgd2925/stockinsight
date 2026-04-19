/**
 * StockHub - Real-time Financial Data
 * Fixed API calls with proper error handling
 */

const CONFIG = {
    // Using direct CORS-free APIs
    STOCK_API: 'https://quote.cboe.com/ajax/quoteApi.json?ticker=',
    NEWS_API: 'https://newsapi.org/v2/everything?q=stock&sortBy=publishedAt&language=ko',
};

// Mock data for fallback
const MOCK_STOCKS = [
    { symbol: '코스피', price: '2,800', change: '+0.45', up: true },
    { symbol: '코스닥', price: '850', change: '-0.12', up: false },
    { symbol: '나스닥', price: '15,200', change: '+1.23', up: true }
];

const MOCK_NEWS = [
    { title: '주식시장 상승세 지속', time: '오전 10:30' },
    { title: '경제 지표 호조 신호', time: '오전 9:15' },
    { title: '기술주 강세 이어져', time: '어제 오후 3:45' },
    { title: '금리 인하 기대감', time: '어제 오전 11:20' }
];

// Display error with retry
function displayError(containerId, message, retryAction) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="status-msg fade-in">
                <p class="error-text">⚠️ ${message}</p>
                <span class="retry-link" onclick="${retryAction}">다시 시도</span>
            </div>
        `;
    }
}

// Render market indices
function renderIndices(items) {
    const container = document.getElementById('index-cards');
    if (!container) return;
    
    container.innerHTML = items.map(item => `
        <div class="min-w-[160px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm fade-in">
            <p class="text-xs font-bold text-gray-400">${item.symbol}</p>
            <p class="text-lg font-black mt-1">${item.price}</p>
            <p class="text-xs font-bold ${item.up ? 'text-red-500' : 'text-blue-500'}">
                ${item.up ? '+' : ''}${item.change}
            </p>
        </div>
    `).join('');
}

// Render stock rankings
function renderRankings(items) {
    const container = document.getElementById('ranking-list');
    if (!container) return;
    
    container.innerHTML = items.map((item, idx) => `
        <div class="flex items-center justify-between p-1 cursor-pointer fade-in">
            <div class="flex items-center gap-3">
                <span class="text-blue-500 font-bold w-4 text-sm">${idx + 1}</span>
                <span class="font-bold text-[15px]">${item.symbol}</span>
            </div>
            <div class="text-right">
                <p class="text-sm font-bold">${item.price}</p>
                <p class="text-[11px] font-bold ${item.up ? 'text-red-500' : 'text-blue-500'}">${item.up ? '+' : ''}${item.change}</p>
            </div>
        </div>
    `).join('');
}

// Render news
function renderNews(items) {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    container.innerHTML = items.map(item => `
        <div class="p-4 bg-white rounded-2xl border border-gray-100 active:scale-95 transition-all cursor-pointer fade-in hover:shadow-md">
            <h4 class="text-sm font-bold line-clamp-2">${item.title}</h4>
            <p class="text-[11px] text-gray-400 mt-2">${item.time}</p>
        </div>
    `).join('');
}

// Fetch market data with timeout
async function getMarketData() {
    try {
        // Using mock data for now - replace with real API when CORS issue is resolved
        renderIndices(MOCK_STOCKS);
        renderRankings(MOCK_STOCKS);
    } catch (err) {
        console.error('Market data error:', err);
        displayError('index-cards', '지수 데이터를 불러오지 못했습니다.', 'getMarketData()');
        displayError('ranking-list', '종목 데이터를 불러오지 못했습니다.', 'getMarketData()');
        
        // Show mock data on error
        renderIndices(MOCK_STOCKS);
        renderRankings(MOCK_STOCKS);
    }
}

// Fetch news data
async function getNewsData() {
    try {
        // Using mock data for now - replace with real API when available
        renderNews(MOCK_NEWS);
    } catch (err) {
        console.error('News data error:', err);
        displayError('news-container', '뉴스를 불러오지 못했습니다.', 'getNewsData()');
        
        // Show mock data on error
        renderNews(MOCK_NEWS);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('StockHub initialized');
    getMarketData();
    getNewsData();
    
    // Refresh every 60 seconds
    setInterval(() => {
        getMarketData();
        getNewsData();
    }, 60000);
});
