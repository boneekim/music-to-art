# 뮤직투아트 (Music to Art)

음악의 감정을 AI가 분석하여 그림으로 변환하는 웹 애플리케이션입니다.

## 🎵 주요 기능

- **음악 입력**: YouTube 링크 또는 음악 제목으로 음악 검색
- **감정 분석**: OpenAI GPT를 사용한 음악 감정 분석
- **AI 이미지 생성**: DALL-E를 사용한 감정 기반 그림 생성
- **음악 미리듣기**: 1분 제한의 음악 재생 기능
- **이미지 다운로드**: 생성된 그림을 로컬에 저장

## 🚀 시작하기

### 1. API 키 설정

`script.js` 파일에서 OpenAI API 키를 설정하세요:

```javascript
this.openaiApiKey = 'your-openai-api-key-here';
```

### 2. 로컬 실행

```bash
# 프로젝트 폴더로 이동
cd music-to-art

# 간단한 HTTP 서버 실행 (Python 3)
python3 -m http.server 8000

# 또는 Node.js 사용
npx http-server
```

### 3. 브라우저에서 접속

```
http://localhost:8000
```

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Services**: OpenAI GPT-3.5, DALL-E 3
- **Music API**: YouTube Data API v3
- **Styling**: CSS Grid, Flexbox, CSS Animations
- **Icons**: Font Awesome

## 📁 파일 구조

```
music-to-art/
├── index.html          # 메인 HTML 파일
├── style.css           # 스타일시트
├── script.js           # JavaScript 로직
└── README.md           # 프로젝트 설명서
```

## 🎨 사용법

1. **음악 입력**: YouTube 링크를 붙여넣거나 음악 제목을 입력
2. **변환 실행**: "그림으로 변환하기" 버튼 클릭
3. **음악 확인**: 음악 플레이어에서 1분 미리듣기
4. **결과 확인**: 감정 분석 결과와 AI 생성 그림 확인
5. **이미지 저장**: 다운로드 버튼으로 그림 저장

## 🔧 설정 옵션

### YouTube Data API
- 현재 설정된 API 키: `AIzaSyAZDwowMlk29oZ1hQnEYyxLNSiSXEZsDOU`
- 필요시 Google Cloud Console에서 새 키 발급

### OpenAI API
- GPT-3.5-turbo 모델 사용
- DALL-E 3 이미지 생성
- 1024x1024 HD 품질

## 🌐 배포

### GitHub Pages
```bash
# Git 저장소 초기화
git init
git add .
git commit -m "Initial commit"

# GitHub에 푸시
git remote add origin https://github.com/username/music-to-art.git
git branch -M main
git push -u origin main
```

### Netlify
1. GitHub 저장소 연결
2. 자동 배포 설정
3. 커스텀 도메인 설정 (선택사항)

## 📱 반응형 디자인

- 모바일, 태블릿, 데스크톱 지원
- CSS Grid와 Flexbox를 활용한 레이아웃
- 터치 친화적 인터페이스

## 🔒 보안 고려사항

- API 키는 클라이언트 사이드에 노출되지 않도록 주의
- 프로덕션 환경에서는 백엔드 API 사용 권장
- CORS 정책 준수

## 🐛 문제 해결

### 일반적인 문제들

1. **API 키 오류**: OpenAI API 키가 올바르게 설정되었는지 확인
2. **YouTube 링크 오류**: 유효한 YouTube URL인지 확인
3. **이미지 생성 실패**: OpenAI API 할당량 확인

### 디버깅

브라우저 개발자 도구의 콘솔에서 오류 메시지를 확인하세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요.

---

**뮤직투아트**로 음악의 감정을 시각적으로 경험해보세요! 🎨🎵
