async function upload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file.");
        return;
    }

    const bucket = 's3-front-quantum';
    const filename = file.name;

      // Example: MinIO running on localhost:9000 without SSL
    const url = `http://localhost:9000/${bucket}/${filename}`; //sa il schimb ca imi faca pe backend

    try {
        const res = await fetch(url, {
            method: 'PUT', //in caz ca e alta metoda
            body: file,
            headers: {
              'Content-Type': file.type
            }
        });

        if (res.ok) {
            alert('Upload successful!');
        } else {
            alert('Upload failed: ' + res.status);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}