const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const statusElem = document.getElementById('status');

const GENERATE_URL_ENDPOINT = '/generate-upload-url';

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
        statusElem.textContent = 'Te rog selectează un fișier.';
        return;
    }

    statusElem.style.color = 'black';

    try {
        console.log('Cer URL-ul pre-semnat de la backend...');
        const response = await fetch(`${GENERATE_URL_ENDPOINT}?fileName=${encodeURIComponent(file.name)}`);
        
        if (!response.ok) {
            throw new Error('Nu am putut obține URL-ul de upload de la server.');
        }

        const { uploadUrl } = await response.json();
        console.log('Am primit URL-ul de upload.');

        statusElem.textContent = 'Se încarcă fișierul...';
        console.log('Încep upload-ul direct către MinIO...');
        
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