
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songContent = $('.song-content');
const audio = $('audio');
const playBtn = $('.btn-play');
const progressLine = $('#progress');
const progressLineLoading = $('.line');
const volumeProgress = $('#volume-progress');
const nextBtn =  $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn =  $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isChangeProgress: false,
    songs: [
        {
            name: 'First date',
            single: 'Frad',
            path: './Music/song1.mp3',
            image: './Image/song1.gif',
            time: '2:53'
        },
        {
            name: 'Sorry I like you',
            single: 'Burbank',
            path: './Music/song2.mp3',
            image:  './Image/song2.gif',
            time: '2:03'
        },
        {
            name: 'Blossoms',
            single: 'Frad',
            path: './Music/song3.mp3',
            image: './Image/song3.gif',
            time: '2:36'
        },
        {
            name: 'Ai rồi cũng bỏ anh đi',
            single: 'VoVanDuc',
            path: './Music/song4.mp3',
            image: './Image/song4.gif',
            time: '2:00'
        },
        {
            name: 'Oblivion',
            single: 'Lily Potter',
            path: './Music/song5.mp3',
            image: './Image/song5.gif',
            time: '2:53'
        },
        {
            name: 'Point the star',
            single: '(Spirited away)',
            path: './Music/song6.mp3',
            image: './Image/song6.gif',
            time: '4:19'
        },
        {
            name: 'Omae Wa Mou',
            single: 'deadman 死人',
            path: './Music/song7.mp3',
            image: './Image/song7.gif',
            time: '1:53'
        }
    ],
    render: function(){
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="card" value="${index}">
                    <div class="card-avatar">
                        <img src="${song.image}" alt=""> 
                    </div>
                    <div class="card-name">
                        <h4>${song.name}</h4>
                        <p>${song.single}</p>
                    </div>
                    <div class="card-time">
                        <p>${song.time}</p>
                    </div>
                </div>
            `
        }).join('')
        $('.list').innerHTML = htmls;
    },
    handleEvent: function(){
            audio.volume = 1;
            volumeProgress.value = audio.volume * 100;
        //Xử lí nút play khi click
            playBtn.onclick = function(){
                if (app.isPlaying) {
                    audio.pause();    
                } else{
                    audio.play();
                }
            }
           /*  const playtest = playBtn.animate(
                { transform: 'rotate(360deg)' },
                {
                    duration: 10000,
                    iterations: Infinity
                }
            )
            playtest.pause() */
            //khi bài hat được play
            audio.onplay = function(){
                app.isPlaying = true;
                playBtn.classList.add('playing');
                playBtn.style.boxShadow = '0 0 15px 4px rgba(181, 220, 243, 0.6)'
                volumeProgress.value = audio.volume * 100;
                /* playtest.play() */
            }
            audio.onpause = function(){
                app.isPlaying = false;
                playBtn.classList.remove('playing');
                playBtn.style.boxShadow = '0 0 5px 2px rgba(181, 220, 243, 0.6)'
            }
            audio.ontimeupdate = function(){
                if (audio.duration){
                    const progressPercent = Math.floor((audio.currentTime) / audio.duration *1000);
                    progressLine.value = progressPercent;
                    progressLineLoading.style.width =Math.floor((progressLine.value / progressLine.max ) * progressLine.offsetWidth) + 'px';
                }
            }
            //Xử lí khi tua bài hát
            progressLine.oninput = function(){
                const seektime = (audio.duration / 1000) * progressLine.value
                audio.currentTime = seektime;
                progressLineLoading.style.width = Math.floor((progressLine.value / progressLine.max ) * progressLine.offsetWidth) + 'px';
            }
            progressLine.onmousedown = function(){
                audio.pause();
                app.isChangeProgress = !app.isChangeProgress;
            }
            progressLine.onmouseup = function(){
                audio.play();
                app.isChangeProgress = !app.isChangeProgress;
            }
            //Xử lí thay đổi âm lượng
            volumeProgress.oninput = function(){
                audio.volume = volumeProgress.value /100;
            } 
            //Xử lí nút next
            nextBtn.onclick = function(){
                if (!app.isChangeProgress){}
                if (app.isRandom){
                    app.playRandomSong()
                } else{
                    app.nextSong();
                }
                audio.play();
            }
            //Xử lí nút prev
            prevBtn.onclick = function(){
                if (app.isRandom){
                    app.playRandomSong()
                } else{
                    app.prevSong();
                }
                audio.play();
            }
            //Xử lí nút random
            randomBtn.onclick =function(){
                app.isRandom = !app.isRandom;
                randomBtn.classList.toggle('active', app.isRandom);
            }
            //Xử lí nút repeat
            repeatBtn.onclick =function(){
                app.isRepeat = !app.isRepeat;
                repeatBtn.classList.toggle('active', app.isRepeat)
            }
            //Xử lí khi hết bài hát
            audio.onended = function(){
                if (app.isRepeat){
                    audio.play()
                } else{
                    nextBtn.click();
                }

            }
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function(){
        audio.src = this.currentSong.path;
        songContent.innerHTML = `
            <p>Now playing:</p>
            <h3>${this.currentSong.name}</h3>
            <img src="${this.currentSong.image}" alt="">  
        `
    },
    nextSong: function(){
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if (this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * app.songs.length)
        } while ( newIndex === app.currentIndex)
        app.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function(){
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();
        //tải thông tin bài hát vào giao diện load chính
        this.loadCurrentSong();
        //Xử lí sự kiện
        this.handleEvent();
        //render playlist
        this.render();

    }
}

app.start()
