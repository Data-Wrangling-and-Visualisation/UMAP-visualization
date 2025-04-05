document.getElementById('submit-csv').addEventListener('click', () => {
    fetch('/process-data')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});
