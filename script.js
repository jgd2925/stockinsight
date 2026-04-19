// 1. 실제 데이터를 가져오는 함수 (지수 및 주가)
async function fetchStockData() {
    // API 키 없이 테스트 가능한 공개 금융 API (Yahoo Finance 기반 오픈 서비스)
    // 실제 서비스 운영 시에는 '한국거래소 API'나 'Alpha Vantage' API 키 발급을 추천합니다.
    const symbols = ['^KS11', '^KQ11', '^IXIC']; // 코스피, 코스닥, 나스닥 심볼
    const container = document.getElementById('index-cards');
    
    container.innerHTML = '<p class="p-5 text-sm text-gray-400">데이터 불러오는 중...</p>';

    try {
        // 지수 정보를 가져오는 fetch 요청 (무료 API 프록시 예시)
        const response = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`);
        const data = await response.json();
        const results = data.quoteResponse.result;

        container.innerHTML = ''; // 로딩 메시지 삭제

        results.forEach(stock => {
            const name = stock.shortName === '^KS11' ? '코스피' : stock.shortName === '^KQ11' ? '코스닥' : '나스닥';
            const price = stock.regularMarketPrice.toLocaleString();
            const change = stock.regularMarketChangePercent.toFixed(2);
            const isUp = stock.regularMarketChangePercent >= 0;

            container.innerHTML += `
                <div class="min-w-[160px] bg-white p-5 rounded-2xl border border-gray-50 shadow-sm active-scale cursor-pointer animate-fade-in">
                    <p class="text-xs font-bold text-gray-400">${name}</p>
                    <p class="text-lg font-black mt-1">${price}</p>
                    <p class="text-xs font-bold ${isUp ? 'text-[#F04452]' : 'text-[#3182F6]'}">
                        ${isUp ? '+' : ''}${change}% ${isUp ? '▲' : '▼'}
                    </p>
                </div>
            `;
        });
    } catch (error) {
        console.error("데이터 로드 실패:", error);
        container.innerHTML = '<p class="p-5 text-sm text-red-400">데이터를 가져오지 못했습니다.</p>';
    }
}

// 2. 실시간 검색 순위 (수동 업데이트 또는 뉴스 API 연동 가능)
function renderRankings() {
    const rankings = [
        { rank: 1, name: '삼성전자', price: '73,100', up: true },
        { rank: 2, name: 'SK하이닉스', price: '185,200', up: true },
        { rank: 3, name: '테슬라', price: '241,500', up: false }
    ];

    const rankingContainer = document.getElementById('ranking-list');
    rankingContainer.innerHTML = rankings.map(item => `
        <div class="flex items-center justify-between group cursor-pointer active-scale">
            <div class="flex items-center gap-3">
                <span class="text-blue-500 font-bold w-4">${item.rank}</span>
                <span class="font-bold">${item.name}</span>
            </div>
            <span class="text-sm font-bold ${item.up ? 'text-[#F04452]' : 'text-[#3182F6]'}">
                ${item.price}원
            </span>
        </div>
    `).join('');
}

// 3. 페이지 로드 시 실행 및 주기적 업데이트
document.addEventListener('DOMContentLoaded', () => {
    fetchStockData();
    renderRankings();

    // 1분마다 실시간 데이터 갱신
    setInterval(fetchStockData, 60000);
});
