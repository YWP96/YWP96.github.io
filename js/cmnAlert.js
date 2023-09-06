// cmnAlert.js
const cmn = {};

// 커스텀 경고창 요소 선택
const customAlert = document.getElementById('custom-alert');
const customAlertMessage = document.querySelector('.alert-message');
const customAlertOkButton = document.getElementById('custom-alert-ok');
const customAlertCancelButton = document.getElementById('custom-alert-cancel'); // "취소" 버튼 추가

let confirmCallback;

customAlertOkButton.addEventListener('click', () => {
    customAlert.classList.add('hidden');
    if (confirmCallback) {
        confirmCallback(true); // 확인 콜백 호출
    }
});

customAlertCancelButton.addEventListener('click', () => {
    customAlert.classList.add('hidden');
    if (confirmCallback) {
        confirmCallback(false); // 취소 콜백 호출
    }
});

cmn.alert = function (message, callback) {
    customAlertMessage.textContent = message;
    fetch('/alert.html')
        .then((response) => response.text())
        .then((html) => {
            customAlert.innerHTML = html;
            customAlert.classList.remove('hidden');
        })
        .catch((error) => {
            console.error('Failed to load alert.html:', error);
        });

    confirmCallback = callback; // 확인 콜백 설정
};
