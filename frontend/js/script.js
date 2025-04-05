let frames = [];
let colors = [];
let currentCamera = null;

document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('upload-csv');
    const fileInput = document.getElementById('csv-file');

    // Trigger file selection when the user clicks the button
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Once a file is chosen, upload it
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) {
            console.error('No file selected.');
            return;
        }

        const formData = new FormData();

        formData.append('csv', file);

        if (!file) {
            console.error('No file selected.');
            return;
        }
    
        fetch('/process-data', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Server response:', data);
                frames = data.points; 
                colors = data.colors;
                // Update slider max based on number of frames
                document.getElementById('frame-slider').max = frames.length - 1;
                renderFrame(0); 
            })
            .catch(error => console.error('Error:', error));
    });
});
// Update renderFrame to group points by color label and use fixed palette.
function renderFrame(frameIndex) {
    const framePoints = frames[frameIndex];
    const groups = {};
    // Group points by corresponding label
    framePoints.forEach((point, i) => {
        let xVal, yVal, zVal;
        if (typeof point === 'object' && !Array.isArray(point)) {
            xVal = point.x;
            yVal = point.y;
            zVal = point.z;
        } else if (Array.isArray(point)) {
            xVal = point[0];
            yVal = point[1];
            zVal = point[2];
        }
        const label = colors[i];
        if (!(label in groups)) {
            groups[label] = { x: [], y: [], z: [] };
        }
        groups[label].x.push(xVal);
        groups[label].y.push(yVal);
        groups[label].z.push(zVal);
    });
    // Create traces with rainbow colormap using HSL
    const groupKeys = Object.keys(groups).sort();
    const totalGroups = groupKeys.length;
    const traces = groupKeys.map((label, idx) => {
        const groupColor = `hsl(${(360 * idx / totalGroups).toFixed(0)}, 100%, 50%)`;
        return {
            x: groups[label].x,
            y: groups[label].y,
            z: groups[label].z,
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 5,
                color: groupColor
            },
            name: `Label ${label}`
        };
    });
    const layout = currentCamera ? { scene: { camera: currentCamera } } : {};

    Plotly.react('visualization-container', traces, layout).then(gd => {
        gd.on('plotly_relayout', d => {
            if (d['scene.camera']) {
                currentCamera = d['scene.camera'];
            }
        });
    });
}

// Event listener for slider to control points.
document.getElementById('frame-slider').addEventListener('input', event => {
    const frameIndex = parseInt(event.target.value);
    document.getElementById('frame-number').textContent = frameIndex;
    if (frames.length > 0) {
        renderFrame(frameIndex);
    }
});