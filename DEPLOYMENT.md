# 🚀 배포 가이드

## GitHub Pages 배포

### 1. GitHub에서 새 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단의 "+" 버튼 클릭 → "New repository" 선택
3. 저장소 이름: `music-to-art`
4. 설명: `음악의 감정을 AI가 분석하여 그림으로 변환하는 웹 애플리케이션`
5. Public으로 설정
6. "Create repository" 클릭

### 2. 로컬 저장소를 GitHub에 연결

```bash
# 원격 저장소 추가 (username을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/username/music-to-art.git

# 메인 브랜치 설정
git branch -M main

# GitHub에 푸시
git push -u origin main
```

### 3. GitHub Pages 활성화

1. GitHub 저장소 페이지에서 "Settings" 탭 클릭
2. 좌측 메뉴에서 "Pages" 선택
3. Source를 "Deploy from a branch"로 설정
4. Branch를 "main"으로 선택
5. "Save" 클릭

### 4. 배포 확인

몇 분 후 다음 URL에서 사이트 확인:
```
https://username.github.io/music-to-art
```

## Netlify 배포 (대안)

### 1. Netlify 계정 생성

1. [Netlify](https://netlify.com)에서 계정 생성
2. "New site from Git" 클릭

### 2. GitHub 저장소 연결

1. GitHub 선택
2. `music-to-art` 저장소 선택
3. Branch: `main` 선택
4. Build command: 비워두기 (정적 사이트)
5. Publish directory: 비워두기
6. "Deploy site" 클릭

### 3. 커스텀 도메인 설정 (선택사항)

1. "Domain settings" → "Custom domains"
2. 도메인 추가 및 DNS 설정

## Vercel 배포 (대안)

### 1. Vercel 계정 생성

1. [Vercel](https://vercel.com)에서 계정 생성
2. "New Project" 클릭

### 2. GitHub 저장소 연결

1. GitHub에서 `music-to-art` 저장소 선택
2. Framework Preset: "Other" 선택
3. "Deploy" 클릭

## 🔧 배포 후 설정

### 1. 환경 변수 설정

프로덕션 환경에서는 API 키를 환경 변수로 관리:

```bash
# .env 파일 생성
OPENAI_API_KEY=your-openai-api-key
YOUTUBE_API_KEY=your-youtube-api-key
```

### 2. CORS 설정

API 호출 시 CORS 오류가 발생할 수 있으므로, 백엔드 프록시 서버 구축을 권장합니다.

### 3. HTTPS 설정

GitHub Pages, Netlify, Vercel 모두 자동으로 HTTPS를 제공합니다.

## 📱 모바일 최적화

### 1. PWA 설정

`manifest.json` 파일을 추가하여 PWA 기능 활성화:

```json
{
  "name": "뮤직투아트",
  "short_name": "뮤직투아트",
  "description": "음악의 감정을 그림으로 변환",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#764ba2",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 2. Service Worker

오프라인 지원을 위한 Service Worker 추가

## 🔒 보안 고려사항

### 1. API 키 보호

- 클라이언트 사이드에 API 키 노출 금지
- 백엔드 API 서버 구축 권장
- API 키 사용량 모니터링

### 2. HTTPS 강제

- 모든 HTTP 요청을 HTTPS로 리다이렉트
- HSTS 헤더 설정

### 3. 콘텐츠 보안 정책

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;">
```

## 📊 성능 최적화

### 1. 이미지 최적화

- WebP 형식 사용
- 이미지 압축
- Lazy loading 구현

### 2. 코드 분할

- JavaScript 번들 최적화
- CSS 최소화
- Gzip 압축 활성화

### 3. 캐싱 전략

- 브라우저 캐싱
- CDN 사용
- Service Worker 캐싱

## 🐛 문제 해결

### 일반적인 배포 문제

1. **404 오류**: GitHub Pages에서 SPA 라우팅 문제
   - 404.html 파일 생성 또는 Hash 라우팅 사용

2. **API 키 오류**: CORS 정책 위반
   - 백엔드 프록시 서버 구축

3. **이미지 로딩 실패**: 상대 경로 문제
   - 절대 경로 또는 base URL 설정

### 디버깅 도구

- 브라우저 개발자 도구
- Network 탭에서 API 호출 확인
- Console에서 오류 메시지 확인

---

배포가 완료되면 `https://username.github.io/music-to-art`에서 뮤직투아트를 사용할 수 있습니다! 🎉
