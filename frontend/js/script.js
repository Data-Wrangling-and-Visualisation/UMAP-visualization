let frames = [];
let currentCamera = null; // new variable to store camera state

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
            frames = data.points; // Assume data.points is an array of 10 frames each of 50 points (3d)
            renderFrame(0); // render first frame
        })
        .catch(error => console.error('Error:', error));
});

// Update renderFrame to use Plotly.react and preserve camera orientation.
function renderFrame(frameIndex) {
    const points = frames[frameIndex];
    const x = [], y = [], z = [];
    points.forEach(point => {
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
            color: 'rgba(0, 155, 255, 0.8)'
        }
    };
    const layout = currentCamera ? { scene: { camera: currentCamera } } : {};
    Plotly.react('visualization-container', [trace], layout).then(gd => {
        gd.on('plotly_relayout', d => {
            if (d['scene.camera']) {
                currentCamera = d['scene.camera'];
            }
        });
    });
}

// Event listener for slider to control frames.
document.getElementById('frame-slider').addEventListener('input', event => {
    const frameIndex = parseInt(event.target.value);
    document.getElementById('frame-number').textContent = frameIndex;
    if (frames.length > 0) {
        renderFrame(frameIndex);
    }
});