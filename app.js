const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MD";

const heading = $('header h2');
const thumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn.btn-next');
const prevBtn = $('.btn.btn-prev');
const randomBtn = $('.btn.btn-random');
const repeatBtn = $('.btn.btn-repeat');
const title = $('.title')
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
            name: 'Unravel',
            singer: 'unknown',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg',
        },
        {
            name: 'Kimita datara',
            singer: 'unknown',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg',
        },
        {
            name: 'Kimita datara',
            singer: 'unknown',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg',
        },
        {
            name: 'Kimita datara',
            singer: 'unknown',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg',
        },
        {
            name: 'Kimita datara',
            singer: 'unknown',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg',
        },
        {
            name: 'Kimita datara',
            singer: 'unknown',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg',
        },
        {
            name: 'Kimita datara',
            singer: 'unknown',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg',
        },
        {
            name: 'Kimita datara',
            singer: 'unknown',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg',
        },

    ],
    setconfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index===this.currentIndex ? 'active' : ''}" data-index = ${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${
                    song.name}</h3>
                <p class="author">${
                    song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>`;
        });
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    },
    handleEvent: function() {

        // xử lí cuộn
        const witdh = cd.offsetWidth;
        document.onscroll = function() {
            const newCdWidth = witdh - window.scrollY;
            cd.style.width = newCdWidth <= 0 ? 0 + 'px' : newCdWidth + 'px';
            cd.style.opacity = newCdWidth / witdh;
        }

        // CD animation 
        const animateCD = thumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity,
        });

        animateCD.pause();

        // xử lí audio
        playBtn.onclick = function() {

            if (!app.isPlaying) audio.play();
            else audio.pause();
        }

        audio.onplay = function() {
            app.isPlaying = true;
            animateCD.play();
            player.classList.add('playing');
        }

        audio.onpause = function() {
            app.isPlaying = false;
            animateCD.pause();
            player.classList.remove('playing');
        }

        // chạy time theo current audio/ progress
        audio.ontimeupdate = function() {
            var percent = audio.currentTime / audio.duration * 100;
            // console.log(percent);
            if (percent) {
                progress.value = Math.floor(percent);
            }

        }

        // tua audio
        progress.onchange = function() {
            // console.log(progress.value);
            // console.log(progress.value * audio.duration * 100);
            const seek = progress.value * audio.duration / 100;
            audio.currentTime = seek;
        }


        //next song 
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // prev song
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        //phát ngẫu nhiên
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom;
            app.setconfig('isRandom', app.isRandom);
            randomBtn.classList.toggle('active', app.isRandom);
            // console.log(randomBtn.classList);
        }

        // xử lí khi bài hát kết thúc
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play();
            } else nextBtn.onclick();
        }

        // lap lai bai hat

        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat;
            app.setconfig('isRepeat', app.isRepeat);
            repeatBtn.classList.toggle('active', app.isRepeat);

        }

        // lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songElement = e.target.closest('.song:not(.active)');
            if (songElement || e.target.closest('.song .option')) {
                // xử lí click khi ấn vào song option
                if (songElement) {
                    app.currentIndex = Number(songElement.dataset.index)
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
            }
        }

    },
    // kéo phần active lên tầm nhìn
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100)
    },
    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name;
        // console.log(thumb);
        thumb.style = `background-image: url(' ${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
        app.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
        app.loadCurrentSong();
    },
    randomSong: function() {
        const tmp = this.currentIndex;
        do {
            this.currentIndex = Math.floor(Math.random() * (this.songs.length - 1));
            // console.log(this.currentIndex);
        } while (this.currentIndex === tmp);
        this.loadCurrentSong();
    },
    start: function() {
        // load config
        this.loadConfig();

        // định nghĩa ra các thuộc tính cho Obj
        this.defineProperties();

        // sử lí các sự kiện
        this.handleEvent();

        // load bài hát đầu tiên vào UI
        this.loadCurrentSong();

        // tạo playlist
        this.render();

    }
}
app.start();