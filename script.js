// Quick Debug Version
console.log('Script loaded at:', new Date().toLocaleTimeString());

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

function renderIndices(items) {
    console.log('Rendering indices:', items);
    const container = document.getElementById('index-cards');
    console.log('Container found:', !!container);
    
    if (!container) {
        console.error('❌ index-cards 컨테이너를 찾을 수 없습니다!');
        return;
    }
    
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

function renderRankings(items) {
    console.log('Rendering rankings:', items);
    const container = document.getElementById('ranking-list');
    console.log('Container found:', !!container);
    
    if (!container) {
        console.error('❌ ranking-list 컨테이너를 찾을 수 없습니다!');
        return;
    }
    
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

function renderNews(items) {
    console.log('Rendering news:', items);
    const container = document.getElementById('news-container');
    console.log('Container found:', !!container);
    
    if (!container) {
        console.error('❌ news-container 컨테이너를 찾을 수 없습니다!');
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="p-4 bg-white rounded-2xl border border-gray-100 active:scale-95 transition-all cursor-pointer fade-in hover:shadow-md">
            <h4 class="text-sm font-bold line-clamp-2">${item.title}</h4>
            <p class="text-[11px] text-gray-400 mt-2">${item.time}</p>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded 실행됨');
    renderIndices(MOCK_STOCKS);
    renderRankings(MOCK_STOCKS);
    renderNews(MOCK_NEWS);
});

// Fallback: 만약 DOMContentLoaded가 작동 안 하면 즉시 실행
if (document.readyState === 'loading') {
    console.log('Document still loading...');
} else {
    console.log('✅ Document already loaded, rendering immediately');
    renderIndices(MOCK_STOCKS);
    renderRankings(MOCK_STOCKS);
    renderNews(MOCK_NEWS);
}
