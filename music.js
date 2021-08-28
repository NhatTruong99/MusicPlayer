
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'player';

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
const list =  $('.list');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
/*     config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))  || {},//vừa lấy và thêm */
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
/*     setConfig: function(key,value){
        app.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(app.config));
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.volumeValue = this.config.volumeValue;
    }, */
    render: function(){
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="card" data-index="${index}">
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
        list.innerHTML = htmls;
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
            }
            progressLine.onmouseup = function(){
                audio.play();
            }
            progressLine.ontouchstart = function(){
                audio.pause();
            }
            progressLine.ontouchend = function(){
                audio.play();
            }
            //Xử lí thay đổi âm lượng
            volumeProgress.oninput = function(){
                audio.volume = volumeProgress.value / 100;
                app.volumeValue = audio.volume;
            } 
            //Xử lí khi click vào card trong list nhạc
            list.onclick = function(e){
                const songNode = e.target.closest('.card:not(.card-active)');
                if (songNode){
                    app.currentIndex = songNode.dataset.index;
                    app.loadCurrentSong();
                    app.changeCardActive();
                    audio.play();
                }
            },
            //Xử lí nút next
            nextBtn.onclick = function(){
                if (app.isRandom){
                    app.playRandomSong()
                } else{
                    app.nextSong();
                }
                app.changeCardActive();
                audio.play();
                app.scrollToActiveSong();
            }
            //Xử lí nút prev
            prevBtn.onclick = function(){
                if (app.isRandom){
                    app.playRandomSong()
                } else{
                    app.prevSong();
                }
                app.changeCardActive();
                audio.play();
                app.scrollToActiveSong();
            }
            //Xử lí nút random
            randomBtn.onclick =function(){
                app.isRandom = !app.isRandom;
/*                 app.setConfig('isRandom',app.isRandom); */
                randomBtn.classList.toggle('active', app.isRandom);
            }
            //Xử lí nút repeat
            repeatBtn.onclick =function(){
                app.isRepeat = !app.isRepeat;
/*                 app.setConfig('isRepeat',app.isRepeat); */
                repeatBtn.classList.toggle('active', app.isRepeat);
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
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.card-active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        },300)
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
    changeCardActive: function(){
        $$('.card').forEach( (card,index) => {
            if (this.currentIndex == index){
                card.classList.add('card-active');
            } else {
                card.classList.remove('card-active');
            }
        })
    },
/*     changeAppConfig: function(){
        randomBtn.classList.toggle('active', app.isRandom);
        repeatBtn.classList.toggle('active', app.isRepeat);
    }, */
    start: function(){
        //lấy giá trị từ local vào app
/*         this.loadConfig(); */
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();
        //tải thông tin bài hát vào giao diện load chính
        this.loadCurrentSong();
        //Xử lí sự kiện
        this.handleEvent();
        //render playlist
        this.render();
        this.changeCardActive();
        //load trạng thái random, repeat
/*         this.changeAppConfig(); */
    }
}

app.start()
