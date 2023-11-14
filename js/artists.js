document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('../json/songsData.json');
        const data = await response.json();
        const songs = data;

        const playlist = document.createElement('div');
        playlist.classList.add('row');
        playlist.classList.add('col-12');
        
        playlist.setAttribute('id', 'playlist');
        document.querySelector('.playlistContainer').appendChild(playlist);

        let index = 0;

        songs.forEach((song) => {
            const listItem = document.createElement('div');
            listItem.className = "songsList";
            listItem.classList.add('col-3');
            listItem.innerHTML = `
                <h1>${song.artist}</h1>
            `;
            /*listItem.addEventListener('click', () => {
                img.src = songs[currentIndex].img;
                artist.innerHTML = songs[currentIndex].artist;
            });*/
            playlist.appendChild(listItem);
            index++;
        });
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }

});