document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('../json/songsData.json');
        const data = await response.json();
        const songs = data;

        const response2 = await fetch('../json/artists.json');
        const data2 = await response2.json();
        const artists = data2;

        const socialsAndVerified = document.getElementById('socialsAndVerified');
        const linkSocials = document.getElementById('linkSocials');
        const aboutArtist = document.getElementById('about');
        const artistSongs = document.createElement('ul');
        artistSongs.setAttribute('id', 'artistSongs');
        document.querySelector('.artistSongsContainer').appendChild(artistSongs);

        artists.forEach((artist) => {
            if (artist.artist === document.title) {
                const artistImage = document.getElementById('artistImage');
                artistImage.setAttribute('src', `${artist.img}`);

                const artistName = document.getElementById('artistName');
                artistName.innerText = artist.artist;

                if (artist.verified === "Y") {
                    socialsAndVerified.innerHTML = `<a id="linkSocials" href="https://www.instagram.com/${artist.socials}/">@${artist.socials}</a> | Verified Artist`;
                    aboutArtist.innerText = `About "${artist.artist}"`
                } else {
                    linkSocials.innerText = `@${artist.socials}`;
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

        /*const playlist = document.createElement('div');
        playlist.classList.add('row');
        playlist.classList.add('col-5');

        playlist.setAttribute('id', 'playlist');
        document.querySelector('.playlistContainer').appendChild(playlist);

        let index = 0;

        artists.forEach((artist) => {
            const divhref = document.createElement('a');
            divhref.className = "artistsList";
            divhref.classList.add('col-3');

            divhref.innerHTML = `
               <div> <h1>${artist.artist}</h1> </div>
               <div> <img src="${artist.img}"/> </div>
            `;

            playlist.appendChild(divhref);
            playlist.style.display = "none";
            index++;
        });*/

    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }

    /*let input;
    input = document.getElementById("search-bar-input");

    function searchBar() {
        let filter, pl, li, div, i, txtValue;

        filter = input.value.toLowerCase();
        pl = document.getElementById("playlist");
        li = pl.getElementsByClassName("artistsList");


        for (i = 0; i < li.length; i++) {
            if (input.length != 0) {
                playlist.style.display = "";
                div = li[i].getElementsByTagName("div")[0];
                txtValue = div.textContent || div.innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            } else if (input.length == 0) {
                console.log("Vacio");
                playlist.style.display = "none";
            }
        }


    }

    input.addEventListener("keyup", searchBar);*/
});