document.getElementById('submit-csv').addEventListener('click', () => {
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];

    if (!file) {
        console.error('No file selected.');
        return;
    }

    const formData = new FormData();
    formData.append('csv', file);

    fetch('/process-data', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => console.log('Server response:', data))
        .catch(error => console.error('Error:', error));
});
