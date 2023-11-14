document.addEventListener("DOMContentLoaded", async function () {

function darkMode() {
    let bodyDK = document.body;
    let chartsDK = document.getElementById("charts")
    bodyDK.classList.toggle("dark-mode");
    chartsDK.classList.toggle("dark-mode");
 }

 const contactUs = document.getElementById('contact-us');
 const artists = document.getElementById('artists');
 
 contactUs.addEventListener('click', function () {
    window.open('../html/contact-us.html', '_self')
});

artists.addEventListener('click', function () {
   window.open('../html/artists.html', '_self')
});


});