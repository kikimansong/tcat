# tcat
개인 프로젝트 Tcat의 프론트엔드 입니다.

![main-image](https://github.com/kikimansong/tcat/blob/main/main-image.gif?raw=true)

+ 배포사이트 https://tcat-front.site/
+ REST API Git https://github.com/kikimansong/tcat-api
+ 디자인 참고, 리소스 제공 https://www.megabox.co.kr/

## 개요
Tcat 프로젝트의 기술 스택, 실행 방법, 소개, 목적에 관한 설명입니다.

---

### 기술 스택
+ npm 9.8.1
+ Node.js 18.18.0
+ Next.js 15.1.2
+ React ^19.0.0
+ TypeScript ^5
+ MUI ^6.2.1

---

### 🖇️ 설치 - 빌드 - 실행

#### 설치
```bash
npm install
```

#### 빌드
```bash
npm run build
```

#### 실행
```bash
# 개발 모드 실행
npm run dev

# 프로덕션 모드 실행
npm run start
```

---

### 소개
Tcat은 영화 예매 사이트를 임의로 제작한 프로젝트 입니다. 주기능은 영화 예매, 부기능은 보편적으로 사용되는 회원 기능, 공지사항 등 데이터 조회의 기능이 존재합니다.

개인적으로 영화관에서 영화 보는 것을 좋아해서 해당 주제를 선택했습니다.

---

### 목적
Tcat 프론트엔드 프로젝트는 HTML, CSS 기초 다지기, React의 컴포넌트 분리 기준 명확화, Next.js로 프로젝트 배포 시 AWS EC2 환경이 아닌 Vercel에 배포 등의 목적으로 작업하게 되었습니다.

또한 백엔드에서 받아오는 데이터들을 프로젝트의 기술 스택들로 어떻게 화면에 노출할지, 그리고 혼자서 해볼 실습과 실무에서 참고하려는 이유에서도 진행했습니다.

## 로그인
로그인은 JWT 방식을 사용합니다. Access Token을 백엔드에서 전달받아 쿠키에 저장합니다.

![cookie](https://github.com/kikimansong/tcat/blob/main/cookie.png?raw=true)

HTTP 통신은 axios를 사용합니다. 
`src/lib/axiosInterceptors.tsx` 파일에 등록된 axios interceptor를 통해 요청시 쿠키에 담긴 Access Token을 Header에 담아 백엔드로 전달합니다.
응답시에는 Refresh Token과 관련된 만료 로직을 수행합니다.


## 상세
예매 페이지에서 영화, 극장, 날짜 및 시간 항목을 선택 후 예매 좌석을 선택할 수 있습니다.

![reservation1](https://raw.githubusercontent.com/kikimansong/tcat/refs/heads/main/reservation1.png)
![resrvation2](https://raw.githubusercontent.com/kikimansong/tcat/refs/heads/main/reservation2.png)


극장 별로 상영관 데이터는 1:N 형태로 매핑되어있습니다.

상영관 좌석은 아래와 같은 JSON 데이터를 변환하여 보여줍니다.

```javascript
{
  "a": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "b": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "c": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "d": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "e": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "f": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "g": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "h": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "i": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10]
}

// 배열의 마지막 요소가 "div"인 경우 다음 행을 전부 blank 처리
{
  "a": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10, "div"],
  "b": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "c": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "d": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "e": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "f": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "g": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "h": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10],
  "i": [1, 2, "", 3, 4, 5, 6, 7, 8, "", 9, 10]
}
```