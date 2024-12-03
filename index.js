const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img');

const music = new Audio();

const songs = [
    {
        path: 'D:/ab/mp3/1nG - Giống Như Mùa Thu ft. @kayteelibrae (Official MV).mp3',  // Đường dẫn MP3 của bài hát
        displayName: 'The Charmer\'s Call',
        cover: 'autumn-landscape-illustration-3d-of-a-golden-foliage-with-houses-roads-and-city-buildings-on-an-day_9863515.jpg!w700wp',
        artist: 'jack',
    },
    {
        path: 'D:/ab/mp3/ANH ĐÃ LÀM GÌ ĐÂU - Nhật Hoàng tự sự kết hợp cùng Thuỳ Chi đầy cảm xúc  Rap Việt 2024 [Performance].mp3',  // Đường dẫn MP3 của bài hát
        displayName: 'aaaaaaa',
        cover: 'D:/ab/images.jpg',
        artist: 'Nhat hoang'},
           {     
        path: 'assets/song3.mp3',  // Đường dẫn MP3 của bài hát
        displayName: 'Intellect',
        cover: 'assets/3.jpg',
        artist: 'Yung Logos',
    }
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;

    // Change play button icon
    playBtn.classList.replace('fa-play', 'fa-pause');
    
    // Set button hover title
    playBtn.setAttribute('title', 'Pause');
    
    // Kiểm tra xem đường dẫn nhạc đã được gán chưa
    if (!music.src) {
        console.error("Đường dẫn nhạc chưa được gán.");
        return;
    }

    // Kiểm tra nếu nhạc chưa được tải
    music.load(); // Đảm bảo rằng tệp âm thanh được tải trước khi phát

    // Cố gắng phát nhạc và xử lý lỗi
    music.play().then(() => {
        console.log("Nhạc đã được phát!");
    }).catch((error) => {
        // Hiển thị lỗi nếu không thể phát nhạc
        console.error("Lỗi khi phát nhạc:", error);
        
        // Kiểm tra lỗi cụ thể liên quan đến autoplay
        if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
            console.error("Trình duyệt chặn phát nhạc tự động. Hãy chắc chắn rằng người dùng đã tương tác với trang.");
        }
    });
}

function pauseMusic() {
    isPlaying = false;
    // Change pause button icon
    playBtn.classList.replace('fa-pause', 'fa-play');
    // Set button hover title
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
}

function changeMusic(direction) {
    // Cập nhật chỉ số bài hát khi chuyển bài
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    
    // Tải bài hát mới mà không phát ngay lập tức
    loadMusic(songs[musicIndex]);
    
    // Đảm bảo chỉ phát nhạc khi người dùng nhấn nút Play
    if (!isPlaying) {
        // Nếu nhạc đang dừng, chỉ tải bài hát mà không tự động phát
        return;
    }

    // Nếu người dùng đã nhấn Play, phát bài hát mới
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    // Kiểm tra nếu giá trị hợp lệ
    if (isNaN(clickX) || isNaN(width) || width === 0) {
        return; // Tránh lỗi nếu giá trị không hợp lệ
    }

    // Kiểm tra music.duration để tránh việc chia cho 0
    if (music.duration && music.duration !== Infinity) {
        music.currentTime = (clickX / width) * music.duration;
    }
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

loadMusic(songs[musicIndex]);
const volumeSlider = document.getElementById('volume');  // Lấy phần tử thanh trượt âm lượng

// Khi người dùng thay đổi giá trị thanh trượt âm lượng
volumeSlider.addEventListener('input', (event) => {
    const volume = event.target.value;  // Giá trị âm lượng từ thanh trượt
    music.volume = volume;  // Điều chỉnh âm lượng của nhạc
});

