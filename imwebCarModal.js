// script.js
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    searchButton.disabled = true;
    searchButton.style.backgroundColor = "#D9D9D9";
    searchButton.style.cursor = 'not-allowed';
});

function updateSearchButtonState() {
    const searchButton = document.getElementById('searchButton');
    if (isPersnlInfoAgreed && isThirdPartyAgreed) {
        searchButton.disabled = false;
        searchButton.style.backgroundColor = "#00B505";
        searchButton.style.cursor = 'pointer';
    } else {
        searchButton.disabled = true;
        searchButton.style.backgroundColor = "#D9D9D9";
        searchButton.style.cursor = 'not-allowed';
    }
}

document.getElementById('carSearchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const regiNumber = document.getElementById("regiNumber").value;
    const ownerName = document.getElementById("ownerName").value;

    if (!regiNumber || !ownerName) {
        alert("차량번호와 소유주명을 입력해주세요.");
        return;
    }

    if (!isPersnlInfoAgreed) {
        alert("개인정보 수집 및 이용에 동의해주세요.");
        return;
    }

    if (!isThirdPartyAgreed) {
        alert("개인정보 제3자 제공에 동의해주세요.");
        return;
    }

    document.getElementById('carModal1').style.display = "flex";
    getCarInfo(regiNumber, ownerName);
});

async function getCarInfo(regiNumber, ownerName) {
    const resultDiv = document.getElementById("result");

    try {
        const response = await fetch('// 실제 API 엔드포인트로 변경', {  
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({
                "REGINUMBER": regiNumber,
                "OWNERNAME": ownerName
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.result === "SUCCESS") {
            const carBrand = data.data.CARVENDER;
            const carName = data.data.CARNAME;
            const carYear = data.data.CARYEAR;
            const carImage = data.data.CARURL;
            const frontTire = data.data.FRONTTIRE;
            const rearTire = data.data.REARTIRE;

            const imageUrl = carImage.startsWith('http') ? carImage : `// 실제 API 엔드포인트로 변경/${carImage}`; // 실제 이미지 엔드포인트로 변경

            const modalCarInfo = document.getElementById("modalCarInfo");
            modalCarInfo.innerHTML = `
                <h3> 차량 정보</h3>
                <h4><strong>제조사:</strong> ${carBrand}</h4>
                <h4><strong>모델:</strong> ${carName} (${carYear}년식)</h4>
                <h4><strong>앞 타이어:</strong> ${frontTire}</h4>
                <h4><strong>뒷 타이어:</strong> ${rearTire}</h4>
                <img src="${imageUrl}" alt="차량 이미지" style="width: 100px; margin-top: 10px;">
                <button type="button" class="close_btn" onclick="closeModal()">닫기</button>
            `;

            showModal();
        } else {
            resultDiv.innerHTML = `<p style='color: red;'> 조회 실패: ${data.errMsg}</p>`;
        }
    } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        resultDiv.innerHTML = `<p style='color: red;'> 오류 발생: ${error.message}</p>`;
    }
}

function showModal() {
    const modal = document.getElementById("carModal1");
    modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("carModal1");
    modal.style.display = "none";
}