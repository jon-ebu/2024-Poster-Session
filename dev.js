import { map } from './map.js';

// DEV ONLY: Clear Cookies
function clearCookies() {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

// Clear cookies on page load
clearCookies();

// DEV ONLY: Extend Control class to create a custom control for displaying coordinates
let Position = L.Control.extend({
    _container: null,
    options: {
        position: 'bottomleft'
    },

    onAdd: function (map) {
        var latlng = L.DomUtil.create('div', 'mouseposition');
        this._latlng = latlng;
        return latlng;
    },

    updateHTML: function (lat, lng) {
        var latlng = lat + " " + lng;
        this._latlng.innerHTML = "LatLng: " + latlng;
    }
});


// // DEV ONLY: Add the Position control to the map
var position = new Position();
map.addControl(position);

// // DEV ONLY: Add mousemove event listener to update coordinates
map.on('mousemove', function (e) {
    var lat = e.latlng.lat.toFixed(7);
    var lng = e.latlng.lng.toFixed(7);
    position.updateHTML(lat, lng);
});


// DEV ONLY: Add contextmenu event listener to copy coordinates on right-click
map.on('contextmenu', function (e) {
    var lat = e.latlng.lat.toFixed(7);
    var lng = e.latlng.lng.toFixed(7);
    var latlng = `${lat}, ${lng}`;
    copyToClipboard(latlng);
    alert(`Copied to clipboard: ${latlng}`);
});

// DEV ONLY: Function to copy text to clipboard
function copyToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}