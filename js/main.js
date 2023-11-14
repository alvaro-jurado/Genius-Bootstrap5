document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('../json/songsData.json');
        const data = await response.json();
        const songs = data;

        let sound;
        let isPlaying = false;
        let currentIndex = 0;
        let currentVolume = 0.5;
        let currentSeekValue = 0;
        let prevVolume = 0;

        const buttonPlay = document.getElementById("btnPlay");
        const buttonSiguiente = document.getElementById("btnSig");
        const buttonAnterior = document.getElementById("btnAnt");
        const artist = document.getElementById("artist");
        const title = document.getElementById("title");
        const img = document.getElementById("img");
        const seekBar = document.getElementById("seek-bar");
        const currentTime = document.getElementById('current-time');
        const duration = document.getElementById('duration');
        const muteIcon = document.getElementById('mute-icon');
        const lowVolumeIcon = document.getElementById('low-volume-icon');
        const highVolumeIcon = document.getElementById('high-volume-icon');
        const volumeBar = document.getElementById('volume-bar');
        const contactUs = document.getElementById('contact-us');
        const getStarted = document.getElementById('getStarted');

        //Equalizer
        let analyser;
        let bufferLength;
        let dataArray;
        let canvas = document.getElementById('equalizer');
        let ctx = canvas.getContext('2d');

        function loadSound() {
            sound = new Howl({
                src: [songs[currentIndex].src],
                onplay: function () {
                    isPlaying = true;
                    buttonPlay.innerHTML = "Pause";
                    updateSeek();
                    img.classList.add("spin-img");
                },
                onpause: function () {
                    isPlaying = false;
                    currentSeekValue = sound.seek();
                    buttonPlay.innerHTML = "Play";
                    img.classList.remove("spin-img");
                },
                onstop: function () {
                    isPlaying = false;
                    buttonPlay.innerHTML = "Play";
                    img.classList.remove("spin-img");
                },
                onload: function () {
                    seekBar.max = sound.duration();
                    duration.textContent = formatTime(Math.round(sound.duration()));
                    sound.seek(currentSeekValue);
                    console.log('currentVolume on load:', currentVolume);
                    updateSeek();
                },
                onend: function () {
                    nextSong();
                    console.log('currentVolume on end:', currentVolume);
                }

            });

            analyser = Howler.ctx.createAnalyser();
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            loadEqualizer();
            animateEqualizer();

            sound.volume(currentVolume);
        }

        function prevSong() {
            if (sound) {
                const seekValue = sound.seek() || 0;
                if (seekValue > 3) {
                    sound.seek(0);
                } else {
                    sound.stop();
                    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
                    isPlaying = false;
                    currentSeekValue = 0;
                    seekBar.value = 0;
                    currentTime.textContent = '0:00';
                    loadSound();
                    img.src = songs[currentIndex].img;
                    title.innerHTML = songs[currentIndex].title;
                    artist.innerHTML = songs[currentIndex].artist;
                    sound.play();
                }
            }
        }


        function nextSong() {
            if (sound) {
                sound.stop();
            }

            currentIndex = (currentIndex + 1) % songs.length;
            isPlaying = false;
            currentSeekValue = 0;
            seekBar.value = 0;
            currentTime.textContent = '0:00';
            loadSound();
            img.src = songs[currentIndex].img;
            title.innerHTML = songs[currentIndex].title;
            artist.innerHTML = songs[currentIndex].artist;
            sound.play();
        }

        function formatTime(secs) {
            const minutes = Math.floor(secs / 60) || 0;
            const seconds = (secs - minutes * 60) || 0;
            return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }

        function updateSeek() {
            setInterval(() => {
                if (sound && isPlaying) {
                    const seekValue = sound.seek() || 0;
                    seekBar.value = seekValue;
                    currentTime.textContent = formatTime(Math.round(seekValue));
                }
            }, 100);
        }

        function updateVolume() {
            const volume = parseFloat(volumeBar.value);
            currentVolume = volume;
            console.log('currentVolume on update:', currentVolume);

            if (sound) {
                sound.volume(currentVolume);
            }

            if (volume === 0) {
                muteIcon.style.display = 'inline';
                lowVolumeIcon.style.display = 'none';
                highVolumeIcon.style.display = 'none';
            } else if (volume < 0.5) {
                muteIcon.style.display = 'none';
                lowVolumeIcon.style.display = 'inline';
                highVolumeIcon.style.display = 'none';
            } else {
                muteIcon.style.display = 'none';
                lowVolumeIcon.style.display = 'none';
                highVolumeIcon.style.display = 'inline';
            }
        }

        function updateVolumeBarOnLoad() {
            volumeBar.value = currentVolume;
            updateVolume();
        }

        function loadEqualizer() {
            Howler.masterGain.connect(analyser);
            //analyser.connect(Howler.ctx.destination); ESTO NO SE PONE, MUCHO VOLUMEN, DUELE
            analyser.fftSize = 8192;
            analyser.getByteTimeDomainData(dataArray);
            //console.log('currentVolume on load equalizer:', currentVolume);
        }

        function animateEqualizer() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyser.getByteFrequencyData(dataArray);
            let centerX = canvas.width / 2;
            let centerY = canvas.height / 2;
            let radius = Math.min(canvas.width, canvas.height) / 4.1;
            let slice = (2 * Math.PI) / bufferLength;
            let volumeFactor = 0.5;

            for (let i = 0; i < bufferLength; i++) {
                let angle = i * slice;
                let x = centerX + Math.cos(angle) * (radius + dataArray[i] * volumeFactor);
                let y = centerY + Math.sin(angle) * (radius + dataArray[i] * volumeFactor);

                ctx.fillStyle = 'rgba(0, 0, 0, 1)';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
            requestAnimationFrame(animateEqualizer);
        }


        const playlist = document.createElement('ul');
        playlist.setAttribute('id', 'playlist');
        document.querySelector('.playlistContainer').appendChild(playlist);

        songs.forEach((song, index) => {
            const listItem = document.createElement('li');
            listItem.className = "songsList";
            listItem.innerHTML = `
                <h3>${song.title}</h3>
                <h4>${song.artist}</h4>
            `;
            listItem.addEventListener('click', () => {
                if (sound) {
                    sound.stop();
                }
                currentIndex = index;
                isPlaying = false;
                currentSeekValue = 0;
                seekBar.value = 0;
                currentTime.textContent = '0:00';
                loadSound();
                img.src = songs[currentIndex].img;
                title.innerHTML = songs[currentIndex].title;
                artist.innerHTML = songs[currentIndex].artist;
                sound.play();
            });
            playlist.appendChild(listItem);
        });

        volumeBar.addEventListener('input', updateVolume);
        highVolumeIcon.addEventListener('click', function () {
            prevVolume = currentVolume;
            console.log("PREVVOLUME"+prevVolume);
            muteIcon.style.display = 'inline';
            lowVolumeIcon.style.display = 'none';
            highVolumeIcon.style.display = 'none';
            volumeBar.value = 0;
            sound.volume(0);
        });
        lowVolumeIcon.addEventListener('click', function () {
            prevVolume = currentVolume;
            console.log("PREVVOLUME"+prevVolume);
            muteIcon.style.display = 'inline';
            lowVolumeIcon.style.display = 'none';
            highVolumeIcon.style.display = 'none';
            volumeBar.value = 0;
            sound.volume(0);
        });
        muteIcon.addEventListener('click', function () {
            volumeBar.value = prevVolume;
            sound.volume(prevVolume);
            if (prevVolume === 0) {
                muteIcon.style.display = 'inline';
                lowVolumeIcon.style.display = 'none';
                highVolumeIcon.style.display = 'none';
            } else if (prevVolume < 0.5) {
                muteIcon.style.display = 'none';
                lowVolumeIcon.style.display = 'inline';
                highVolumeIcon.style.display = 'none';
            } else {
                muteIcon.style.display = 'none';
                lowVolumeIcon.style.display = 'none';
                highVolumeIcon.style.display = 'inline';
            }
        });
        


        seekBar.addEventListener('input', function () {
            sound.seek(seekBar.value);
            currentTime.textContent = formatTime(Math.round(seekBar.value));
        });

        buttonPlay.addEventListener("click", () => {
            if (isPlaying) {
                sound.pause();
            } else {
                if (!sound) {
                    loadSound();
                }
                sound.play();
            }
        });

        buttonSiguiente.addEventListener("click", nextSong);
        buttonAnterior.addEventListener("click", prevSong);

        contactUs.addEventListener('click', function () {
            window.open('../html/contact-us.html', '_self')
        });        

        img.src = songs[currentIndex].img;
        title.innerHTML = songs[currentIndex].title;
        artist.innerHTML = songs[currentIndex].artist;

        updateVolumeBarOnLoad();
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
});
