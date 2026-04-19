/**
 * StockHub 실제 기능 구현부
 */

// 1. 상태 관리 (State)
let state = {
    indices: [],
    themes: [
        { id: 't1', name: '초전도체', change: '+12.5%', icon: '⚡', stocks: ['신성델타테크', '서남', '덕성'] },
        { id: 't2', name: '인공지능', change: '+4.2%', icon: '🤖', stocks: ['네이버', '한미반도체', '이수페타시스'] }
    ],
    rankings: [
        { rank: 1, name: '삼성전자', symbol: '005930.KS' },
        { rank: 2, name: 'SK하이닉스', symbol: '000660.KS' },
        { rank: 3, name: '카카오', symbol: '035720.KS' }
    ],
    activeTab: 'all'
};

// 2. 실제 데이터 가져오기 (Yahoo Finance API + Proxy)
async function fetchRealTimeData() {
    const symbols = ['^KS11', '^KQ11', '^IXIC']; // 코스피, 코스닥, 나스닥
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`;
    
    // 브라우저 CORS 에러 방지를 위한 프록시 사용
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    try {
        const response = await fetch(proxyUrl);
        const rawData = await response.json();
        const data = JSON.parse(rawData.contents);
        
        state.indices = data.quoteResponse.result.map(stock => ({
            name: stock.symbol === '^KS11' ? '코스피' : stock.symbol === '^KQ11' ? '코스닥' : '나스닥',
            price: stock.regularMarketPrice.toLocaleString(undefined, {minimumFractionDigits: 2}),
            change: stock.regularMarketChangePercent.toFixed(2),
            isUp: stock.regularMarketChangePercent >= 0
        }));
        
        renderIndices();
    } catch (error) {
        console.error("데이터 로드 중 오류:", error);
    }
}

// 3. 화면 렌더링 함수들
function renderIndices() {
    const container = document.getElementById('index-cards');
    if (!container) return;
    
    container.innerHTML = state.indices.map(item => `
        <div class="min-w-[160px] bg-white p-5 rounded-2xl border border-gray-50 shadow-sm">
            <p class="text-xs font-bold text-gray-400">${item.name}</p>
            <p class="text-lg font-black mt-1">${item.price}</p>
            <p class="text-xs font-bold ${item.isUp ? 'text-red-500' : 'text-blue-500'}">
                ${item.isUp ? '+' : ''}${item.change}% ${item.isUp ? '▲' : '▼'}
            </p>
        </div>
    `).join('');
}

function renderThemes() {
    const container = document.getElementById('theme-container');
    if (!container) return;

    container.innerHTML = state.themes.map(theme => `
        <div onclick="handleThemeClick('${theme.id}')" class="p-4 bg-gray-50 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-gray-100 active:scale-95 transition-all">
            <div>
                <p class="font-bold text-gray-800 text-sm">${theme.name}</p>
                <p class="text-xs text-red-500 mt-1 font-semibold">${theme.change}</p>
            </div>
            <span class="text-2xl">${theme.icon}</span>
        </div>
    `).join('');
}

// 4. 이벤트 핸들러
window.handleThemeClick = (themeId) => {
    const theme = state.themes.find(t => t.id === themeId);
    alert(`${theme.name} 관련 종목: ${theme.stocks.join(', ')}`);
    // 실제라면 여기서 관련 종목 피드를 필터링하는 로직이 들어갑니다.
};

// 5. 검색 기능 구현
const searchInput = document.querySelector('input[placeholder="검색"]');
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value;
            if (query) {
                window.open(`https://finance.yahoo.com/quote/${query}`, '_blank');
            }
        }
    });
}

// 6. 초기 실행
document.addEventListener('DOMContentLoaded', () => {
    // 스켈레톤 UI 표시 (데이터 오기 전)
    const indexContainer = document.getElementById('index-cards');
    indexContainer.innerHTML = '<div class="min-w-[160px] h-24 skeleton"></div>'.repeat(3);

    fetchRealTimeData();
    renderThemes();
    
    // 30초마다 갱신
    setInterval(fetchRealTimeData, 30000);
});
