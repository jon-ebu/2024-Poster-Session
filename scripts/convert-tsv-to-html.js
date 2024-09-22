
import { initializeFooTable } from './initializeFooTable.js';

function displayTable(tableData) {
    const table = document.getElementById('tsvTable');
    table.innerHTML = '';

    // Generate table headers
    let headerRow = '<thead><tr>';
    tableData[0].slice(2).forEach(header => { // Skip the first two columns
        if (header === 'Easel Board') {
            headerRow += `<th>${header}</th>`;
        } else if (header === 'Poster Title') {
            headerRow += `<th class="poster-title">${header}</th>`;
        } else {
            headerRow += `<th data-breakpoints="xs">${header}</th>`;
        }
    });
    headerRow += '</tr></thead>';
    table.innerHTML += headerRow;

    // Generate table rows
    let bodyRows = '<tbody>';
    for (let i = 1; i < tableData.length; i++) { // Start from 1 to skip the header row
        let row = '<tr>';
        tableData[i].slice(2).forEach((cell, index) => { // Skip the first two columns
            if (tableData[0][index + 2] === 'Poster Title') {
                row += `<td class="poster-title">${cell}</td>`;
            } else {
                row += `<td>${cell}</td>`;
            }
        });
        row += '</tr>';
        bodyRows += row;
    }
    bodyRows += '</tbody>';
    table.innerHTML += bodyRows;

    // Initialize FooTable after table is generated
    initializeFooTable();
}
// Wait for the DOM to load and load the TSV file
document.addEventListener('DOMContentLoaded', function () {
    // Fetch the TSV file using AJAX
    fetch('data/2024-poster-session-coordinates.tsv')
        .then(response => response.text())
        .then(text => {
            const rows = text.split('\n');
            const tableData = rows.map(row => row.split('\t').map(cell => cell.trim()));
            displayTable(tableData);
        })
        .catch(error => console.error('Error fetching TSV file:', error));
});