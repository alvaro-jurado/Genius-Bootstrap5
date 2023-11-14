document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('../json/radioData.json');
        const data = await response.json();
        const radios = data;

        let sound;
        let isPlaying = false;
        let currentIndex = 0;
        let currentVolume = 0.5;

        const buttonPlay = document.getElementById("btnPlay");
        const buttonSiguiente = document.getElementById("btnSig");
        const buttonAnterior = document.getElementById("btnAnt");
        const freq = document.getElementById("freq");
        const title = document.getElementById("title");
        const img = document.getElementById("img");
        const muteIcon = document.getElementById('mute-icon');
        const lowVolumeIcon = document.getElementById('low-volume-icon');
        const highVolumeIcon = document.getElementById('high-volume-icon');
        const volumeBar = document.getElementById('volume-bar');
        const contactUs = document.getElementById('contact-us');
        const artists = document.getElementById('artists');

        function loadRadio() {
            sound = new Howl({
                src: [radios[currentIndex].src],
                html5: true,
                onplay: function () {
                    isPlaying = true;
                    buttonPlay.innerHTML = "Pause";
                },
                onpause: function () {
                    isPlaying = false;
                    buttonPlay.innerHTML = "Play";
                }
            });

            sound.volume(currentVolume);
        }

        function prevRadio() {
            if (sound) {
                sound.stop();
            }

            currentIndex = (currentIndex - 1 + radios.length) % radios.length;
            isPlaying = false;
            loadRadio();
            freq.innerHTML = radios[currentIndex].freq;
            title.innerHTML = radios[currentIndex].title;
            sound.play();
        }

        function nextRadio() {
            if (sound) {
                sound.stop();
            }

            currentIndex = (currentIndex + 1) % radios.length;
            isPlaying = false;
            loadRadio();
            freq.innerHTML = radios[currentIndex].freq;
            title.innerHTML = radios[currentIndex].title;
            sound.play();
        }

        function updateVolume() {
            const volume = parseFloat(volumeBar.value);
            currentVolume = volume;

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

        const playlist = document.createElement('ul');
        playlist.setAttribute('id', 'playlist');
        document.querySelector('.playlistContainer').appendChild(playlist);

        radios.forEach((radio, index) => {
            const listItem = document.createElement('li');
            listItem.className = "radioList";
            listItem.innerHTML = `
                <h3>${radio.freq}</h3>
                <h4>${radio.title}</h4>
            `;
            listItem.addEventListener('click', () => {
                if (sound) {
                    sound.stop();
                }
                currentIndex = index;
                isPlaying = false;
                loadRadio();
                freq.innerHTML = radios[currentIndex].freq;
                title.innerHTML = radios[currentIndex].title;
                sound.play();
            });
            playlist.appendChild(listItem);
        });

        volumeBar.addEventListener('input', updateVolume);

        buttonPlay.addEventListener("click", () => {
            if (isPlaying) {
                sound.pause();
            } else {
                if (!sound) {
                    loadRadio();
                }
                sound.play();
            }
        });

        buttonSiguiente.addEventListener("click", nextRadio);
        buttonAnterior.addEventListener("click", prevRadio);

        contactUs.addEventListener('click', function () {
            window.open('../html/contact-us.html', '_self')
        });        

        artists.addEventListener('click', function () {
            window.open('../html/artists.html', '_self')
         });

        freq.innerHTML = radios[currentIndex].freq;
        title.innerHTML = radios[currentIndex].title;

        updateVolumeBarOnLoad();
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
});
