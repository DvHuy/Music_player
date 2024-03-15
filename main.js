/*
1. Render sings
2. Scroll top
3. Play/pause/seek
4. CD rotate
5. Next / prev
6. Random
7. Next / Repeat when ended
8. Active song
9. Scroll active song into view
10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const body = document.body;
const playerBackground = $('.player__background');
const player = $('.player');
const cd = $('.cd');
const playlist = $('.playlist');
const heading = $('.header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    songs:[
        {
            name: "Sau lời từ khước",
            singer: "Phan Mạnh Quỳnh",
            path: "./music/SauLoiTuKhuoc.mp3",
            image: "./images/SLTK.jpg",
            background_image: "./images/SLTK.jpg"
        },
        {
            name: "Những lời hứa bỏ quên",
            singer: "Vũ",
            path: "./music/NhungLoiHuaBoQuen.mp3",
            image: "./images/NLHBQ.jpg",
            background_image: "./images/NLHBQ.jpg",
        },
        {
            name: "Có lẽ bên nhau là sai",
            singer: "Thaolinh x ViAm",
            path: "./music/CoLeBenNhauLaSai.mp4",
            image: "./images/CLBNLS.jpg",
            background_image: "./images/CLBNLS.jpg"
        },
        {
            name: "Get you back",
            singer: "Hy:Rain",
            path: "./music/GetYouBack.mp3",
            image: "./images/GYB.jpeg",
            background_image: "./images/GYB.jpeg"
        },
        {
            name: "Attention",
            singer: "Charlie Puth",
            path: "./music/Attention.mp3",
            image: "./images/Attention.jpg",
            background_image: "./images/Attention.jpg"
        },
        {
            name: "Untouchable",
            singer: "ITZY",
            path: "./music/Untouchable.mp3",
            image: "./images/untouchable.jpg",
            background_image: "./images/untouchable.jpg"
        },
    ],
    render: function(){
        const htmls = this.songs.map((song, index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : '' }">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `;
        });
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const cdWidth = cd.offsetWidth ;
        const _this = this;

        //Xử lý quay đĩa
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,  //10s
            iterations: Infinity
        })

        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ đĩa CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop; // 2 cách lấy đề phòng trình duyệt khác không hoạt động
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
        }

        //Khi song được play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        //Khi song được pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                progress.style.setProperty('--progress-width', progressPercent + '%'); // Sử dụng biến --progress-width để cập nhật chiều dài
            }
        }

        //Khi tua bài hát
        progress.onchange = function(e){
            const seekTime = e.target.value * audio.duration  / 100;
            audio.currentTime = seekTime;
        }

        //Khi next bài hát
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Khi prev bài hát
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Xử lý bật/tắt random song
        randomBtn.onclick = function(){
           _this.isRandom = !_this.isRandom;
           randomBtn.classList.toggle('active', _this.isRandom);
        }

        //Xử lý next song khi ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }
            else{
                nextBtn.click();
            }
        }

        // Xử lý khi bật/tắt repeat song
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        
        
    },
    scrollToActiveSong:function(){
        if(this.currentIndex < 2){
            setTimeout(()=>{
                $('.song.active').scrollIntoView(
                   {
                    behavior: 'smooth',
                    block: 'end'
                   }
                )
            }, 650)
        }
        else{
            setTimeout(()=>{
                $('.song.active').scrollIntoView(
                   {
                    behavior: 'smooth',
                    block: 'nearest'
                   }
                )
            }, 650)
        }
    }
    ,
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        
        body.style.backgroundImage = `url('${this.currentSong.background_image}')`;
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex > this.songs.length - 1){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function(){
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe và xử lý các sự kiện  (DOM event)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render();

    }
}

app.start();