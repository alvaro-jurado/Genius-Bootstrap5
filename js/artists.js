document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('../json/artists.json');
        const data = await response.json();
        const artists = data;

        const playlist = document.createElement('div');
        playlist.classList.add('row');
        playlist.classList.add('col-12');
        
        playlist.setAttribute('id', 'playlist');
        document.querySelector('.playlistContainer').appendChild(playlist);

        let index = 0;

        artists.forEach((artist) => {
            const listItem = document.createElement('div');
            listItem.className = "artistsList";
            listItem.classList.add('col-3');
            listItem.classList.add('card');
            listItem.classList.add('flip-z');
            listItem.innerHTML = `
               <div class="card-front"> <h1>${artist.artist}</h1> </div>
               <div class="card-back"> <img src="${artist.img}"/> </div>
            `;
            /*listItem.addEventListener('click', () => {
                img.src = artists[currentIndex].img;
                artist.innerHTML = artists[currentIndex].artist;
            });*/
            playlist.appendChild(listItem);
            index++;
        });
        console.log(playlist);
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }


    let input;
    input = document.getElementById("search-bar-input");

    function searchBar() {
        let filter, pl, li, div, i, txtValue;

        filter = input.value.toUpperCase();
        pl = document.getElementById("playlist");
        li = pl.getElementsByClassName("artistsList");
        
        for (i = 0; i < li.length; i++) {
            div = li[i].getElementsByTagName("div")[0];
            txtValue = div.textContent || div.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }

    input.addEventListener("keyup", searchBar);

});