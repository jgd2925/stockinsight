@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');

body {
    font-family: 'Pretendard', sans-serif;
    background-color: #F2F4F6;
    margin: 0;
}

.card-white {
    background: white;
    border-radius: 28px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.header-glass {
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
}

/* 에러 메시지 스타일 */
.error-box {
    width: 100%;
    padding: 20px;
    background-color: #FFF0F0;
    border: 1px solid #FFE0E0;
    border-radius: 20px;
    text-align: center;
}

.retry-btn {
    margin-top: 8px;
    padding: 6px 16px;
    background-color: #F04452;
    color: white;
    border-radius: 10px;
    font-size: 12px;
    font-weight: bold;
}

/* 스켈레톤 로딩 */
@keyframes skeleton-blink {
    0%, 100% { background-color: #f0f0f0; }
    50% { background-color: #e8e8e8; }
}
.skeleton {
    animation: skeleton-blink 1.5s infinite;
    border-radius: 15px;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.fade-in {
    animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
