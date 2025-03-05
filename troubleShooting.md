# 25.03.05  

## 문제 상황
- 개인정보 동의 체크박스 및 검색 버튼 기능 개선 필요

1. isChecked() 함수의 문법적 오류
```
function isChecked(iconId) {
    let rectId = iconId === "agreeColInfo" ? "bg-rect" : "bg-rect2";
    let rect = document.getElementById(rectId);
    return document.getElementById('iconId').getAttribute('fill' === "#00B505");}

document.getElementById('iconId') 부분에서 'iconId'를 문자열 리터럴로 잘못 사용함 
``` 

-> 코드 수정<br>
```
function isChecked(iconId) {
    let rectId = iconId === "agreeColInfo" ? "bg-rect" : "bg-rect2";
    let rect = document.getElementById(rectId);
    return rect.getAttribute('fill') === "#00B505";}
```

```
2. 체크박스 검증 로직의 위치 -> submitFormWithApiCall() 함수 내부나 시작 부분에 배치로 수정
function submitFormWithApiCall() {
    // 체크박스 검증 추가
    if (!isChecked("agreeColInfo")) { 
        alert("개인정보 수집 및 이용에 동의 해 주시기 바랍니다.");
        return;
    }
    if (!isChecked("agreeThirdIcon")) {
        alert("개인정보 제3자 제공동의 해 주시기 바랍니다.");
        return;
    }

    // 아임웹 기본 폼 제출 메서드
    //SITE_FORM.confirmInputForm('w20250128c2b3964c37d0c', 'N');

    // 2초 뒤에 차량 조회 API 호출
    setTimeout(() => {
        getCarInfo();
    }, 2000);

    // 모달 표시
    document.getElementById('carModal1').style.display = "block";
}
```

```
3. eventListener 중복 사용 
1번 코드 주석처리
document.getElementById('searchButton').addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log("검색 버튼 클릭");
    submitFormWithApiCall();
});

<button type="button" class="btn btn-primary _input_form_submit" id="searchButton"
                     data-style="solid" data-height="55px" data-color="#FFFFFF" data-icon="false"
                     style="min-width:150px; padding:12px; font-weight: 25px;" 
                     onclick="submitFormWithApiCall()">검색
</button>

```
 
4. 모달 팝업 순서 오류
submitFormWithApiCall()이 호출오류로 차량정보 로딩모달팝업 및  개인정보제공 alert  호출됨<br>
=> 개인정보 수집 및 제3자 제공 동의 체크박스를 클릭 후 검색 버튼이 활성화<br>
=>  그 후에 모달창이 나오도록 구현
``` 
    // 개인정보 및 제3자 제공 동의 상태 추적 변수
    let isPersnlInfoAgreed = false;
    // 개인정보 수집 동의 SVG 클릭 이벤트
    document.getElementById("agreeColInfo").addEventListener("click", function() {
        let rect = document.getElementById("bg-rect");
        let check = document.getElementById("Etc/Check");

        if(rect.getAttribute('fill') === "#00B505") {
            rect.setAttribute('fill', "#D9D9D9"); // 원래 색상 (회색)
            // check.setAttribute('stroke', "#FFFFFF");  // 체크 아이콘 흰색
            check.style.display = "none";
            isPersnlInfoAgreed = false;
        } else {
        rect.setAttribute('fill', "#00B505");
        //  check.setAttribute('stroke', "#FFFFFF");
        check.style.display = "block";
        isPersnlInfoAgreed = true;
        }
        updateSearchButtonState();  
    });
 
    document.getElementById("thirdpartyText").onclick = function() {
        document.getElementById("thirdPartyContent").style.display = "block";
    }

    document.getElementById("closeThirdPartyBtn").onclick = function() {
        document.getElementById("thirdPartyContent").style.display = "none";
    }

    document.addEventListener("click", function(event){
    let thirdPartyContent = document.getElementById("thirdPartyContent");
    let thirdpartyText = document.getElementById("thirdpartyText");

    // thirdPartyContent 열려 있는 상태이고, 클릭한 요소가 thirdPartyContent 내부가 아닐 때 닫기
    if (thirdPartyContent.style.display === "block" && 
        !thirdPartyContent.contains(event.target) && 
        event.target !== thirdpartyText){
            thirdPartyContent.style.display = "none";
        }
        });
 
```

```
  검색 버튼 상태 업데이트 함수
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
   
    // 검색 버튼 초기 상태 비활성화
    document.getElementById('searchButton').disabled = true;
    document.getElementById('searchButton').backgroundColor = "#D9D9D9";
    document.getElementById('searchButton').style.cursor = 'not-allowed';

     // 경고
    let agreeColInfo = document.getElementById('agreeColInfo');
    let agreeThirdInfo = document.getElementById('agreeThirdIcon');
    // 체크박스 확인 로직 
    function isChecked(iconId) {
        let rectId = iconId === "agreeColInfo" ? "bg-rect" : "bg-rect2";
        let rect = document.getElementById(rectId);
        //return document.getElementById('iconId').getAttribute('fill' === "#00B505"); 리터럴 오류 발생 ('iconId')
        return rect.getAttribute('fill') === "#00B505";
    }
   
    document.getElementById('searchButton').addEventListener('click', function(event){
        event.preventDefault();
        
        // 입렵값 확인
        if(!regiNumber || !ownerName) {
            alert("차량번호와 소유주명을 입력해주세요");
            return;
        }
        // 조건 충족시 API 호출 및 모달 표시 
        submitFormWithApiCall();
        document.getElementById('carModal1').style.display = "block";
        
    });
 
``` 
## 해결 
1. 개인정보 수집 및 제3자 제공 동의 체크박스를 모두 클릭해야 검색 버튼이 활성화<br>
2. 검색 버튼은 초기에 비활성화처리 및 회색으로 표시<br>
3. 두 개의 체크박스를 모두 클릭시 검색 버튼이 초록색으로 활성화<br>
4. 검색 버튼 클릭 시 차량번호와 소유주명 입력 여부를 먼저 확인<br>
5. 조건 충족시 submitFormWithApiCall() 함수가 호출되고 모달창이 표시
 
 
## 코드 변경 내용
- `isPersonalInfoAgreed`, `isThirdPartyAgreed` 상태 변수 추가
- `updateSearchButtonState()` 함수 구현
- 검색 버튼 클릭 이벤트 리스너 개선
 
## 남은 문제
- 개인정보 모달 창 화면 중앙내 배치
- 스크롤 사인 다시 클릭시 처음 위치로 오게끔 하기
- api 호출 실패 → 어제도 같은 상황, 이용 횟수 문의 하기

 
