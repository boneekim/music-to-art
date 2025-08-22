class MusicToArt {
    constructor() {
        this.apiKey = 'AIzaSyAZDwowMlk29oZ1hQnEYyxLNSiSXEZsDOU';
        this.openaiApiKey = 'AIzaSyChnvqp_ZKq8x_zB7sBDhegkrkrNwEiE-g'; // OpenAI API 키
        this.testMode = true; // 테스트 모드 활성화 (올바른 OpenAI API 키 대기 중)
        this.currentAudio = null;
        this.isPlaying = false;
        this.progressInterval = null;
        this.currentTime = 0;
        this.maxTime = 60; // 1분 제한
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAudioContext();
    }

    bindEvents() {
        const convertBtn = document.getElementById('convertBtn');
        const playBtn = document.getElementById('playBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        convertBtn.addEventListener('click', () => this.handleConvert());
        playBtn.addEventListener('click', () => this.togglePlay());
        downloadBtn.addEventListener('click', () => this.downloadImage());

        // Enter 키로 변환 실행
        document.getElementById('musicInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleConvert();
            }
        });
    }

    setupAudioContext() {
        // Web Audio API 설정
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    async handleConvert() {
        const input = document.getElementById('musicInput').value.trim();
        if (!input) {
            alert('음악 링크 또는 제목을 입력해주세요.');
            return;
        }

        this.showLoading();
        this.hideResult();

        try {
            let musicInfo;
            
            if (this.isYouTubeLink(input)) {
                musicInfo = await this.extractYouTubeInfo(input);
            } else {
                musicInfo = await this.searchMusic(input);
            }

            if (musicInfo) {
                await this.processMusic(musicInfo);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('음악 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            this.hideLoading();
        }
    }

    isYouTubeLink(input) {
        return input.includes('youtube.com') || input.includes('youtu.be');
    }

    async extractYouTubeInfo(url) {
        try {
            // YouTube Data API를 사용하여 비디오 정보 추출
            const videoId = this.extractVideoId(url);
            if (!videoId) {
                throw new Error('유효하지 않은 YouTube 링크입니다.');
            }

            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${this.apiKey}`);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const video = data.items[0];
                return {
                    title: video.snippet.title,
                    artist: video.snippet.channelTitle,
                    thumbnail: video.snippet.thumbnails.medium.url,
                    videoId: videoId,
                    type: 'youtube'
                };
            }
        } catch (error) {
            console.error('YouTube 정보 추출 오류:', error);
            throw error;
        }
    }

    extractVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    async searchMusic(query) {
        try {
            // YouTube Data API를 사용하여 음악 검색
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' music')}&type=video&maxResults=1&key=${this.apiKey}`);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const video = data.items[0];
                return {
                    title: video.snippet.title,
                    artist: video.snippet.channelTitle,
                    thumbnail: video.snippet.thumbnails.medium.url,
                    videoId: video.id.videoId,
                    type: 'youtube'
                };
            }
        } catch (error) {
            console.error('음악 검색 오류:', error);
            throw error;
        }
    }

    async processMusic(musicInfo) {
        try {
            // 음악 플레이어 표시
            this.displayMusicPlayer(musicInfo);

            // 감정 분석 및 이미지 생성
            const emotionAnalysis = await this.analyzeEmotion(musicInfo.title);
            const generatedImage = await this.generateArtwork(emotionAnalysis, musicInfo.title);

            // 결과 표시
            this.displayResults(emotionAnalysis, generatedImage, musicInfo.title);
        } catch (error) {
            console.error('음악 처리 오류:', error);
            throw error;
        }
    }

    async analyzeEmotion(musicTitle) {
        // 테스트 모드일 때는 더미 데이터 반환
        if (this.testMode) {
            // 음악 제목에 따른 다양한 감정 데이터
            const emotionData = {
                'love': {
                    emotions: ['사랑스러운', '따뜻한', '로맨틱한'],
                    description: '이 음악은 사랑과 따뜻함이 가득한 로맨틱한 분위기를 연출합니다.',
                    mood: '로맨틱',
                    intensity: 8
                },
                'sad': {
                    emotions: ['슬픈', '감성적인', '우울한'],
                    description: '이 음악은 깊은 슬픔과 감성을 담고 있어 마음을 울리는 분위기입니다.',
                    mood: '감성적',
                    intensity: 6
                },
                'happy': {
                    emotions: ['즐거운', '활기찬', '신나는'],
                    description: '이 음악은 즐거움과 활기를 불러일으키는 신나는 분위기입니다.',
                    mood: '활기찬',
                    intensity: 9
                },
                'rock': {
                    emotions: ['강렬한', '열정적인', '파워풀한'],
                    description: '이 음악은 강렬하고 열정적인 에너지가 넘치는 파워풀한 분위기입니다.',
                    mood: '강렬',
                    intensity: 9
                }
            };

            // 음악 제목에서 키워드 찾기
            const title = musicTitle.toLowerCase();
            let selectedEmotion = emotionData['love']; // 기본값

            if (title.includes('sad') || title.includes('슬픈') || title.includes('우울')) {
                selectedEmotion = emotionData['sad'];
            } else if (title.includes('happy') || title.includes('즐거운') || title.includes('신나')) {
                selectedEmotion = emotionData['happy'];
            } else if (title.includes('rock') || title.includes('강렬') || title.includes('열정')) {
                selectedEmotion = emotionData['rock'];
            }

            return selectedEmotion;
        }

        try {
            // OpenAI API를 사용하여 감정 분석 (실제 API 키가 있을 때)
            const prompt = `다음 음악 제목에서 느껴지는 감정을 분석해주세요: "${musicTitle}"
            
            다음 형식으로 JSON 응답을 제공해주세요:
            {
                "emotions": ["감정1", "감정2", "감정3"],
                "description": "이 음악에서 느껴지는 감정에 대한 상세한 설명",
                "mood": "전체적인 분위기",
                "intensity": "감정의 강도 (1-10)"
            }`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openaiApiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: '당신은 음악 감정 분석 전문가입니다. 음악의 제목과 가사를 바탕으로 감정을 정확하게 분석해주세요.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 500
                })
            });

            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // JSON 파싱 시도
            try {
                return JSON.parse(content);
            } catch (e) {
                // JSON 파싱 실패 시 기본 형식 반환
                return {
                    emotions: ['신비로운', '감성적인', '몽환적인'],
                    description: '이 음악은 신비롭고 감성적인 분위기를 연출합니다.',
                    mood: '몽환적',
                    intensity: 7
                };
            }
        } catch (error) {
            console.error('감정 분석 오류:', error);
            // 오류 시 기본 감정 반환
            return {
                emotions: ['신비로운', '감성적인', '몽환적인'],
                description: '이 음악은 신비롭고 감성적인 분위기를 연출합니다.',
                mood: '몽환적',
                intensity: 7
            };
        }
    }

    async generateArtwork(emotionAnalysis, musicTitle) {
        // 테스트 모드일 때는 더미 이미지 반환
        if (this.testMode) {
            // 감정에 따른 다양한 더미 이미지
            const imageUrls = {
                '로맨틱': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop&crop=center',
                '감성적': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1024&h=1024&fit=crop&crop=center',
                '활기찬': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1024&h=1024&fit=crop&crop=center',
                '강렬': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1024&h=1024&fit=crop&crop=center'
            };

            return imageUrls[emotionAnalysis.mood] || imageUrls['로맨틱'];
        }

        try {
            // OpenAI DALL-E API를 사용하여 이미지 생성 (실제 API 키가 있을 때)
            const prompt = `Create a beautiful, artistic image that represents the emotions and mood of this music: "${musicTitle}". 
            Emotions: ${emotionAnalysis.emotions.join(', ')}. 
            Mood: ${emotionAnalysis.mood}. 
            Style: Abstract, artistic, emotional, dreamy, high quality, digital art.`;

            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openaiApiKey}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    n: 1,
                    size: '1024x1024',
                    quality: 'hd',
                    style: 'natural'
                })
            });

            const data = await response.json();
            return data.data[0].url;
        } catch (error) {
            console.error('이미지 생성 오류:', error);
            // 오류 시 기본 이미지 반환
            return 'https://via.placeholder.com/1024x1024/667eea/ffffff?text=AI+Generated+Art';
        }
    }

    displayMusicPlayer(musicInfo) {
        const player = document.getElementById('musicPlayer');
        const thumbnail = document.getElementById('thumbnail');
        const trackTitle = document.getElementById('trackTitle');
        const trackArtist = document.getElementById('trackArtist');

        // 썸네일 설정
        if (musicInfo.thumbnail) {
            thumbnail.innerHTML = `<img src="${musicInfo.thumbnail}" alt="음악 썸네일">`;
        } else {
            thumbnail.innerHTML = '<i class="fas fa-music"></i>';
        }

        trackTitle.textContent = musicInfo.title;
        trackArtist.textContent = musicInfo.artist;

        player.style.display = 'block';

        // 오디오 설정 (YouTube 링크인 경우)
        if (musicInfo.type === 'youtube') {
            this.setupYouTubeAudio(musicInfo.videoId);
        }
    }

    setupYouTubeAudio(videoId) {
        // YouTube IFrame API를 사용하여 오디오 재생
        if (window.YT && window.YT.Player) {
            this.createYouTubePlayer(videoId);
        } else {
            // YouTube IFrame API 로드
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                this.createYouTubePlayer(videoId);
            };
        }
    }

    createYouTubePlayer(videoId) {
        this.ytPlayer = new window.YT.Player('thumbnail', {
            height: '80',
            width: '80',
            videoId: videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0
            },
            events: {
                'onReady': (event) => {
                    this.ytPlayer = event.target;
                }
            }
        });
    }

    togglePlay() {
        const playBtn = document.getElementById('playBtn');
        const icon = playBtn.querySelector('i');

        if (this.isPlaying) {
            this.pauseAudio();
            icon.className = 'fas fa-play';
            this.isPlaying = false;
        } else {
            this.playAudio();
            icon.className = 'fas fa-pause';
            this.isPlaying = true;
        }
    }

    playAudio() {
        if (this.ytPlayer && this.ytPlayer.playVideo) {
            this.ytPlayer.playVideo();
            this.startProgressTimer();
        }
    }

    pauseAudio() {
        if (this.ytPlayer && this.ytPlayer.pauseVideo) {
            this.ytPlayer.pauseVideo();
            this.stopProgressTimer();
        }
    }

    startProgressTimer() {
        this.currentTime = 0;
        this.progressInterval = setInterval(() => {
            this.currentTime++;
            this.updateProgress();
            
            if (this.currentTime >= this.maxTime) {
                this.pauseAudio();
                this.isPlaying = false;
                document.getElementById('playBtn').querySelector('i').className = 'fas fa-play';
            }
        }, 1000);
    }

    stopProgressTimer() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const timeDisplay = document.getElementById('timeDisplay');
        
        const progress = (this.currentTime / this.maxTime) * 100;
        progressFill.style.width = `${progress}%`;
        
        const currentTimeStr = this.formatTime(this.currentTime);
        const maxTimeStr = this.formatTime(this.maxTime);
        timeDisplay.textContent = `${currentTimeStr} / ${maxTimeStr}`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    displayResults(emotionAnalysis, generatedImage, musicTitle) {
        this.showResult();
        
        // 감정 태그 표시
        const emotionTags = document.getElementById('emotionTags');
        emotionTags.innerHTML = emotionAnalysis.emotions.map(emotion => 
            `<span class="emotion-tag">${emotion}</span>`
        ).join('');

        // 감정 설명 표시
        const emotionDescription = document.getElementById('emotionDescription');
        emotionDescription.innerHTML = `
            <p><strong>전체 분위기:</strong> ${emotionAnalysis.mood}</p>
            <p><strong>감정 강도:</strong> ${emotionAnalysis.intensity}/10</p>
            <p>${emotionAnalysis.description}</p>
        `;

        // 생성된 이미지 표시
        const generatedImageElement = document.getElementById('generatedImage');
        generatedImageElement.src = generatedImage;
        generatedImageElement.alt = `${musicTitle} - AI 생성 그림`;

        // 그림 설명 표시
        const artworkDescription = document.getElementById('artworkDescription');
        artworkDescription.textContent = `이 그림은 "${musicTitle}"에서 느껴지는 ${emotionAnalysis.mood}한 감정을 시각적으로 표현한 것입니다. ${emotionAnalysis.emotions.join(', ')}한 요소들을 담아 AI가 창작한 독특한 아트워크입니다.`;
    }

    downloadImage() {
        const image = document.getElementById('generatedImage');
        const link = document.createElement('a');
        link.download = 'music-to-art-generated-image.png';
        link.href = image.src;
        link.click();
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showResult() {
        document.getElementById('resultSection').style.display = 'block';
    }

    hideResult() {
        document.getElementById('resultSection').style.display = 'none';
    }
}

// 페이지 로드 시 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new MusicToArt();
});
