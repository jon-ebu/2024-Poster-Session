
let currentPage = 1;
const rowsPerPage = 100;
let tableData = [];

// Fetch the TSV file using AJAX
fetch('2024-poster-session-coordinates.tsv')
    .then(response => response.text())
    .then(text => {
        const rows = text.split('\n');
        tableData = rows.map(row => row.split('\t').map(cell => cell.trim()));
        currentPage = 1;
        displayTable();
        initializeFooTable();
    })
    .catch(error => console.error('Error fetching TSV file:', error));

function displayTable() {
    const table = document.getElementById('tsvTable');
    table.innerHTML = '';

    // Generate table headers
    let headerRow = '<thead><tr>';
    tableData[0].slice(2).forEach(header => {
        headerRow += `<th>${header}</th>`;
    });
    headerRow += '</tr></thead>';
    table.innerHTML += headerRow;

    // Generate table rows for the current page
    let bodyRows = '<tbody>';
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(start + rowsPerPage - 1, tableData.length - 1);
    for (let i = start; i <= end; i++) {
        let row = '<tr>';
        tableData[i].slice(2).forEach((cell, index) => {
            row += `<td>${cell}</td>`;
        });
        row += '</tr>';
        bodyRows += row;
    }
    bodyRows += '</tbody>';
    table.innerHTML += bodyRows;
}