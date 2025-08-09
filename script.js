import { animate, stagger } from "https://esm.run/framer-motion@11";

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    loadLyrics();
    runEntryAnimations();
    setupAudioControls();
});

async function loadLyrics() {
    try {
        const response = await fetch('lyrics.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const lyricsData = await response.json();
        const container = document.getElementById('lyrics-container');
        if (!container) return;

        container.innerHTML = ''; 

        lyricsData.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'lyrics-section opacity-0';
            
            const title = document.createElement('h3');
            title.className = 'lyrics-title text-2xl';
            title.textContent = section.type;

            const text = document.createElement('p');
            text.className = 'lyrics-text';
            text.textContent = section.lines.join('\n');
            
            sectionDiv.appendChild(title);
            sectionDiv.appendChild(text);
            container.appendChild(sectionDiv);
        });

        animateLyricsSections();

    } catch (error) {
        console.error("Failed to load lyrics:", error);
        const container = document.getElementById('lyrics-container');
        if (container) {
            container.innerHTML = `<p class="text-center text-red-400">无法加载歌词。</p>`;
        }
    }
}

function runEntryAnimations() {
    animate(
        'header',
        { opacity: 1, y: 0 },
        { duration: 1, delay: 0.2, ease: "easeOut" }
    );
    animate(
        '#player-section',
        { opacity: 1, y: 0 },
        { duration: 1, delay: 0.5, ease: "easeOut" }
    );
}

function animateLyricsSections() {
    const sections = document.querySelectorAll('.lyrics-section');
    animate(
        sections,
        { opacity: 1, y: 0 },
        { 
            duration: 0.8, 
            delay: stagger(0.15, { startDelay: 0.8 }), 
            ease: "easeOut" 
        }
    );
}

function setupAudioControls() {
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const volumeBtn = document.getElementById('volume-btn');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    
    // 播放/暂停按钮
    playBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playBtn.innerHTML = '<i data-lucide="pause" class="w-5 h-5"></i>';
        } else {
            audioPlayer.pause();
            playBtn.innerHTML = '<i data-lucide="play" class="w-5 h-5"></i>';
        }
        lucide.createIcons();
    });
    
    // 音量控制
    let isMuted = false;
    volumeBtn.addEventListener('click', () => {
        if (isMuted) {
            audioPlayer.volume = 1;
            volumeBtn.innerHTML = '<i data-lucide="volume-2" class="w-5 h-5"></i>';
        } else {
            audioPlayer.volume = 0;
            volumeBtn.innerHTML = '<i data-lucide="volume-x" class="w-5 h-5"></i>';
        }
        isMuted = !isMuted;
        lucide.createIcons();
    });
    
    // 更新时间显示
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioPlayer.duration);
    });
    
    audioPlayer.addEventListener('timeupdate', () => {
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    });
    
    // 格式化时间
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
}
