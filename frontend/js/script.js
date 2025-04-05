let frames = [];
let colors = [];

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
        .then(data => {
            console.log('Server response:', data);
            frames = data.points; 
            colors = data.colors;
            renderFrame(0); 
        })
        .catch(error => console.error('Error:', error));
});

// Update renderFrame to use Plotly.react and preserve camera orientation.
function renderFrame(frameIndex) {
    const points = frames[frameIndex];
    const x = [], y = [], z = [];
    points.forEach(point => {
        // Support for both object and array formats
        if (typeof point === 'object' && !Array.isArray(point)) {
            x.push(point.x);
            y.push(point.y);
            z.push(point.z);
        } else if (Array.isArray(point)) {
            x.push(point[0]);
            y.push(point[1]);
            z.push(point[2]);
        }
    });
    const trace = {
        x,
        y,
        z,
        mode: 'markers',
        type: 'scatter3d',
        marker: {
            size: 5,
            color: colors,         // use global colors variable
            colorscale: 'Viridis', // add colorscale
            colorbar: { title: "Category" }
        }
    };

    Plotly.react('visualization-container', [trace]);
}


// Event listener for slider to control points.
document.getElementById('frame-slider').addEventListener('input', event => {
    const frameIndex = parseInt(event.target.value);
    document.getElementById('frame-number').textContent = frameIndex;
    if (frames.length > 0) {
        renderFrame(frameIndex);
    }
});