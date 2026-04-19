/**
 * StockHub - Real Data First, Mock Data Fallback
 */

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

// Display error message
function displayError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="status-msg fade-in">
                <p class="error-text">⚠️ ${message}</p>
            </div>
        `;
    }
}

// Render indices
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

// Render rankings
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

// Render news - FIXED (완전한 함수)
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

// Get market data with fallback
async function getMarketData() {
    try {
        console.log('📊 Fetching market data...');
        
        // Show mock data immediately as fallback
        renderIndices(MOCK_STOCKS);
        renderRankings(MOCK_STOCKS);
        
        // Try to fetch real data from proxy
        const CONFIG = {
            PROXY: 'https://api.allorigins.win/get?url=',
            STOCK_API: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=',
            SYMBOLS: ['^KS11', '^KQ11', '^IXIC']
        };
        
        const targetUrl = `${CONFIG.STOCK_API}${CONFIG.SYMBOLS.join(',')}`;
        const response = await fetch(`${CONFIG.PROXY}${encodeURIComponent(targetUrl)}`);
        
        if (response.ok) {
            const raw = await response.json();
            const data = JSON.parse(raw.contents).quoteResponse.result;
            if (data && data.length > 0) {
                console.log('✅ Real data loaded');
                renderIndices(data.filter(s => s.symbol.startsWith('^')));
                renderRankings(data.filter(s => !s.symbol.startsWith('^')));
            }
        }
    } catch (err) {
        console.error('⚠️ Error loading market data:', err);
        // Keep showing mock data
    }
}

// Get news data with fallback
async function getNewsData() {
    try {
        console.log('📰 Fetching news data...');
        
        // Show mock news immediately
        renderNews(MOCK_NEWS);
        
        // Try to fetch real news
        const CONFIG = {
            PROXY: 'https://api.allorigins.win/get?url=',
            NEWS_RSS: 'https://fs.jtbc.co.kr/RSS/newsflash.xml'
        };
        
        const response = await fetch(`${CONFIG.PROXY}${encodeURIComponent(CONFIG.NEWS_RSS)}`);
        
        if (response.ok) {
            const raw = await response.json();
            const parser = new DOMParser();
            const xml = parser.parseFromString(raw.contents, "text/xml");
            const items = xml.querySelectorAll("item");
            
            if (items && items.length > 0) {
                console.log('✅ Real news loaded');
                renderNews(Array.from(items).slice(0, 4));
            }
        }
    } catch (err) {
        console.error('⚠️ Error loading news:', err);
        // Keep showing mock news
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 StockHub initialized');
    getMarketData();
    getNewsData();
    
    // Refresh every 60 seconds
    setInterval(() => {
        getMarketData();
        getNewsData();
    }, 60000);
});
