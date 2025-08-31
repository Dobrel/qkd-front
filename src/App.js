// Importăm librăria MinIO și modulul 'fs' pentru a lucra cu fișiere
import * as Minio from 'minio';
import fs from 'fs';
import path from 'path';

// --- CONFIGURARE ---
// Schimbă aceste valori dacă e cazul
const minioConfig = {
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'dorincazan',
    secretKey: 'Eiy7ic5esh6ohp0a'
};

const bucketName = 'test-bucket'; // Numele bucket-ului pe care vrei să-l folosești
const fileName = 'salut-lume.txt'; // Numele pe care fișierul îl va avea în MinIO
const filePath = './' + fileName; // Calea către fișierul local

// --- LOGICA PRINCIPALĂ ---
async function runDemo() {
    console.log("🚀 Pornim demonstrația MinIO...");

    try {
        // 1. Conectarea la MinIO
        const minioClient = new Minio.Client(minioConfig);
        console.log("Conectat la MinIO.");

        // 2. Verificăm dacă bucket-ul există. Dacă nu, îl creăm.
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            console.log(`Bucket-ul "${bucketName}" nu există. Îl creăm acum...`);
            await minioClient.makeBucket(bucketName, 'us-east-1');
            console.log(`Bucket-ul "${bucketName}" a fost creat.`);
        } else {
            console.log(`Bucket-ul "${bucketName}" există deja.`);
        }

        // 3. Creăm un fișier local de test pentru a avea ce încărca
        fs.writeFileSync(filePath, 'Acesta este un fișier de test generat automat.');
        console.log(`Am creat un fișier local de test: "${fileName}"`);

        // 4. Încărcăm fișierul în MinIO
        const metaData = { 'Content-Type': 'text/plain' };
        console.log(`Se încarcă fișierul în MinIO...`);
        await minioClient.fPutObject(bucketName, fileName, filePath, metaData);
        console.log(`Succes! Fișierul a fost încărcat ca "${fileName}" în bucket-ul "${bucketName}".`);
        console.log("Poți verifica fișierul în consola MinIO: http://localhost:9001");

    } catch (err) {
        console.error("A apărut o eroare:", err);
    }
}

// Pornim funcția principală
runDemo();