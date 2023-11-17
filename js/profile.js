document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('../json/songsData.json');
        const data = await response.json();
        const songs = data;

        const response2 = await fetch('../json/artists.json');
        const data2 = await response2.json();
        const artists = data2;

        const socialsAndVerified = document.getElementById('socialsAndVerified');
        const aboutArtist = document.getElementById('about');
        const artistSongs = document.createElement('ul');
        artistSongs.setAttribute('id', 'artistSongs');
        document.querySelector('.artistSongsContainer').appendChild(artistSongs);

        artists.forEach((artist) => {
            if(artist.artist === document.title){
                const artistImage = document.getElementById('artistImage');
                artistImage.setAttribute('src', `${artist.img}`);

                const artistName = document.getElementById('artistName');
                artistName.innerText = artist.artist;

                if (artist.verified === "Y"){
                    socialsAndVerified.innerText = `@${artist.socials} | Verified Artist`;
                    aboutArtist.innerText = `About "${artist.artist}"`
                } else {   
                    socialsAndVerified.innerText = `@${artist.socials}`;
                }
            }
        });


        songs.forEach((song) => {
            if (song.artist === document.title) {
                const listItem = document.createElement('li');
                listItem.className = "songsList";
                listItem.innerHTML = `
                <img id="listSongImg" src="${song.img}"/>
                <div class="titleArtist">
                <h3>${song.title}</h3>
                <h4>${song.artist}</h4>
                </div>
            `;
                artistSongs.appendChild(listItem);
            }
        });
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
});