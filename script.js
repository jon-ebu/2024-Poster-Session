document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([34.106091765125356, -117.71197644197387], 19);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 25,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
});