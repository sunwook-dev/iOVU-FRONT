# iOVU-FRONT

🚀 React 기반의 브랜드 분석 및 챗봇 서비스 프론트엔드 애플리케이션

iOVU-FRONT는 Modern React, Material-UI, 그리고 다양한 소셜 로그인을 지원하는 브랜드 분석 플랫폼입니다. Spring Boot 백엔드와 연동하여 실시간 브랜드 데이터 분석 및 AI 챗봇 서비스를 제공합니다.

## ✨ 주요 기능

- 🔐 **다중 소셜 로그인**: Kakao, Naver, Google 로그인 지원
- 🤖 **AI 챗봇**: 실시간 브랜드 분석 및 질의응답
- 📊 **브랜드 분석**: 브랜드 랭킹 및 상세 리포트 조회
- 🔍 **검색 기능**: 브랜드 및 키워드 기반 검색
- 📱 **반응형 UI**: Material-UI 기반 모바일 친화적 인터페이스
- 🔄 **실시간 데이터**: RESTful API를 통한 실시간 데이터 동기화

## 🛠️ 기술 스택

### Frontend

- **React** 18.2.0 - UI 라이브러리
- **Material-UI** 5.15.0 - UI 컴포넌트 라이브러리
- **React Router DOM** 6.8.0 - 클라이언트 사이드 라우팅
- **React Icons** 5.5.0 - 아이콘 라이브러리
- **Emotion** - CSS-in-JS 스타일링

### Development

- **React Scripts** 5.0.1 - 빌드 및 개발 도구
- **Jest** - 단위 테스트 프레임워크
- **React Testing Library** - 컴포넌트 테스트

## 📁 프로젝트 구조

```
iOVU-FRONT/
├── public/                     # 정적 자원
│   ├── image/                  # 이미지 파일
│   ├── landingpage/           # 랜딩페이지 이미지
│   ├── brandRanking.json      # 브랜드 랭킹 데이터
│   └── manifest.json          # PWA 매니페스트
├── src/
│   ├── component/             # 재사용 가능한 컴포넌트
│   │   ├── auth/              # 인증 관련 컴포넌트
│   │   │   └── KakaoLogin.jsx
│   │   ├── common/            # 공통 컴포넌트
│   │   │   ├── CommonButton.jsx
│   │   │   ├── CommonPaper.jsx
│   │   │   ├── CommonSubtitle.jsx
│   │   │   └── CommonTitle.jsx
│   │   └── layout/            # 레이아웃 컴포넌트
│   │       ├── Layout.jsx
│   │       ├── drawer/        # 사이드바
│   │       ├── footer/        # 푸터
│   │       └── navBar/        # 네비게이션 바
│   ├── contexts/              # React Context
│   │   ├── AuthContext.js     # 인증 상태 관리
│   │   └── SidebarContext.js  # 사이드바 상태 관리
│   ├── mui/                   # Material-UI 설정
│   │   ├── color.jsx          # 색상 팔레트
│   │   └── MuiProvider.jsx    # MUI 테마 프로바이더
│   ├── pages/                 # 페이지 컴포넌트
│   │   ├── Chat.jsx           # 챗봇 페이지
│   │   ├── LandingPage.jsx    # 랜딩 페이지
│   │   ├── Login.jsx          # 로그인 페이지
│   │   ├── OAuth2Callback.jsx # OAuth 콜백
│   │   └── SearchPage.jsx     # 검색 페이지
│   ├── routes/                # 라우팅 설정
│   │   └── router.js
│   ├── services/              # 외부 서비스 연동
│   │   └── socialLogin.js
│   ├── utils/                 # 유틸리티 함수
│   │   ├── auth.js            # 인증 유틸리티
│   │   └── auth.js.backup
│   ├── App.js                 # 메인 앱 컴포넌트
│   └── index.js              # 엔트리 포인트
└── build/                     # 빌드 결과물
```

## 🚀 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 클론
git clone https://github.com/sunwook-dev/iOVU-FRONT.git
cd iOVU-FRONT

# 의존성 설치
npm install
```

### 2. 개발 서버 실행

```bash
# 개발 모드로 실행
npm start
# 또는
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 3. 프로덕션 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물은 build/ 폴더에 생성됩니다
```

### 4. 테스트 실행

```bash
# 단위 테스트 실행
npm test
```

## ⚙️ 환경 설정

### 백엔드 서버 요구사항

- **포트**: 8081 (기본값)
- **CORS 설정**: 프론트엔드 도메인 허용 필수
- **인증**: JWT 토큰 기반 인증
- **API 엔드포인트**: `/api/*` 패턴

### 로컬 스토리지 구조

```javascript
// 사용자 정보
localStorage.setItem(
  "user_info",
  JSON.stringify({
    id: "user_id",
    name: "user_name",
    email: "user@email.com",
  })
);

// 액세스 토큰
localStorage.setItem("access_token", "jwt_token_here");
```

### API 요청 헤더

모든 API 요청에는 다음 헤더가 포함됩니다:

```javascript
{
  'Authorization': 'Bearer ${access_token}',
  'Content-Type': 'application/json'
}
```

## 🔒 인증 플로우

1. **소셜 로그인**: Kakao/Naver/Google OAuth2 인증
2. **토큰 발급**: 백엔드에서 JWT 토큰 발급
3. **로컬 저장**: 사용자 정보 및 토큰을 localStorage에 저장
4. **자동 인증**: 페이지 새로고침 시 토큰 유효성 검증
5. **토큰 갱신**: 만료된 토큰 자동 갱신 또는 재로그인

## 📋 주요 컴포넌트 설명

### Layout Components

- **`Layout.jsx`**: 전체 페이지 레이아웃 및 인증 상태 관리
- **`NavBar.jsx`**: 상단 네비게이션 바, 사용자 정보 표시
- **`Drawer.jsx`**: 사이드바, 리포트 목록 및 네비게이션
- **`Footer.jsx`**: 하단 푸터

### Page Components

- **`LandingPage.jsx`**: 서비스 소개 및 주요 기능 안내
- **`Login.jsx`**: 소셜 로그인 페이지
- **`Chat.jsx`**: AI 챗봇 대화 인터페이스
- **`SearchPage.jsx`**: 브랜드 검색 및 필터링
- **`OAuth2Callback.jsx`**: 소셜 로그인 콜백 처리

### Context Providers

- **`AuthContext.js`**: 전역 인증 상태 관리
- **`SidebarContext.js`**: 사이드바 열림/닫힘 상태 관리

## 🔧 개발 가이드

### 새 페이지 추가

1. `src/pages/` 폴더에 새 컴포넌트 생성
2. `src/routes/router.js`에 라우트 추가
3. 필요시 네비게이션 메뉴에 추가

### 새 컴포넌트 추가

1. `src/component/` 적절한 폴더에 컴포넌트 생성
2. Material-UI 컴포넌트 및 테마 활용
3. PropTypes 또는 TypeScript 타입 정의 (권장)

### API 연동

1. `src/utils/auth.js`의 기존 패턴 참고
2. 에러 처리 및 로딩 상태 관리 구현
3. 인증 토큰 자동 포함 확인

## 🐛 트러블슈팅

### 자주 발생하는 문제

1. **CORS 에러**: 백엔드 서버의 CORS 설정 확인
2. **인증 실패**: 토큰 만료 또는 잘못된 토큰 형식
3. **라우팅 문제**: React Router DOM 설정 확인
4. **빌드 실패**: 의존성 버전 충돌 또는 syntax 에러

### 디버깅 팁

- 브라우저 개발자 도구의 Console 및 Network 탭 활용
- localStorage의 토큰 및 사용자 정보 확인
- 백엔드 API 응답 상태 코드 및 메시지 확인

## 📦 배포

### Vercel 배포 (권장)

1. Vercel 계정 생성 및 GitHub 연동
2. 프로젝트 import 및 자동 배포 설정
3. 환경 변수 설정 (필요시)

### 기타 배포 옵션

- **Netlify**: 정적 사이트 호스팅
- **AWS S3 + CloudFront**: AWS 기반 배포
- **Docker**: 컨테이너 기반 배포

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 사유 라이선스 하에 배포됩니다.

## 📞 문의사항

프로젝트에 대한 문의사항이나 버그 리포트는 GitHub Issues를 통해 제출해 주세요.

---

**iOVU Team** - 브랜드 분석의 새로운 패러다임
