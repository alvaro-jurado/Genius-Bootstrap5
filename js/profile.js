document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('../json/songsData.json');
        const data = await response.json();
        const songs = data;
    
    const artistSongs = document.createElement('ul');
    artistSongs.setAttribute('id', 'artistSongs');
    document.querySelector('.artistSongsContainer').appendChild(artistSongs);

    songs.forEach((song, index) => {
        if (song.artist === "Sasha Alex Sloan") {
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