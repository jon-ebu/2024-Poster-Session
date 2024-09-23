const divider = document.getElementById('divider');
const mapDiv = document.getElementById('map');
const tableContainer = document.querySelector('.table-container');

let isDragging = false;

divider.addEventListener('mousedown', function(e) {
    isDragging = true;
    document.body.style.cursor = 'row-resize';
});

document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    const containerHeight = document.querySelector('.container').clientHeight;
    const newMapHeight = e.clientY / containerHeight * 100;
    const newTableHeight = 100 - newMapHeight;
    mapDiv.style.flex = `0 0 ${newMapHeight}%`;
    tableContainer.style.flex = `0 0 ${newTableHeight}%`;
});

document.addEventListener('mouseup', function(e) {
    if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
    }
});