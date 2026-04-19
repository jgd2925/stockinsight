// 1. 샘플 데이터 정의
const stockIndices = [
    { name: '코스피', value: '2,642.30', change: '+1.24%', up: true },
    { name: '코스닥', value: '860.12', change: '-0.52%', up: false },
    { name: '나스닥', value: '16,274.94', change: '+0.82%', up: true }
];

const rankings = [
    { rank: 1, name: '삼성전자', price: '72,500', up: true },
    { rank: 2, name: 'SK하이닉스', price: '182,100', up: false },
    { rank: 3, name: '에코프로', price: '540,000', up: true }
];

// 2. 화면에 데이터를 그려주는 함수
function renderApp() {
    // 지수 카드 렌더링
    const indexContainer = document.getElementById('index-cards');
    indexContainer.innerHTML = stockIndices.map(item => `
        <div class="min-w-[160px] bg-white p-5 rounded-2xl border border-gray-50 shadow-sm active-scale cursor-pointer">
            <p class="text-xs font-bold text-gray-400">${item.name}</p>
            <p class="text-lg font-black mt-1">${item.value}</p>
            <p class="text-xs font-bold ${item.up ? 'text-red-500' : 'text-blue-500'}">
                ${item.change} ${item.up ? '▲' : '▼'}
            </p>
        </div>
    `).join('');

    // 실시간 랭킹 렌더링
    const rankingContainer = document.getElementById('ranking-list');
    rankingContainer.innerHTML = rankings.map(item => `
        <div class="flex items-center justify-between group cursor-pointer active-scale">
            <div class="flex items-center gap-3">
                <span class="text-blue-500 font-bold w-4">${item.rank}</span>
                <span class="font-bold">${item.name}</span>
            </div>
            <span class="text-sm font-bold ${item.up ? 'text-red-500' : 'text-blue-500'}">
                ${item.price}원
            </span>
        </div>
    `).join('');
}

// 3. 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
    
    // 로고 클릭 시 새로고침 효과 등 추가 가능
    document.getElementById('logo').addEventListener('click', () => {
        location.reload();
    });
});
