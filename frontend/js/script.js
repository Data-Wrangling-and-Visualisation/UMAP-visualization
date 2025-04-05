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
            render3DVisualization(data.points); // Call the visualization function
        })
        .catch(error => console.error('Error:', error));
});

// Function to render 3D visualization
function render3DVisualization(points) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = ''; // Clear previous visualizations

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(points.flat());
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.05 });
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}
