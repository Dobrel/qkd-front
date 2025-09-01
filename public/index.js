const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const statusElem = document.getElementById('status');

const GENERATE_URL_ENDPOINT = '/generate-upload-url';

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];

    statusElem.style.color = 'black';

    try {
        const response = await fetch(`${GENERATE_URL_ENDPOINT}?fileName=${encodeURIComponent(file.name)}`);
        
        const { uploadUrl } = await response.json();

        statusElem.textContent = 'Se încarcă fișierul...';
        
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }
        });

        if (!uploadResponse.ok) {
            throw new Error('Upload-ul către MinIO a eșuat.');
        }

        statusElem.textContent = 'Fișier încărcat cu succes!';
        statusElem.style.color = 'green';
        console.log('Upload finalizat cu succes.');

    } catch (error) {
        statusElem.textContent = `Eroare: ${error.message}`;
        statusElem.style.color = 'red';
        console.error(error);
    }
});