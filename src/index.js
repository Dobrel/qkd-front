import { minioConfig, appConfig } from './config.js';
import * as Minio from 'minio';
import fs from 'fs';
import path from 'path';

const bucketName = appConfig.bucketName;
const fileName = appConfig.fileName;
const filePath = './' + fileName;

async function runDemo() {
    console.log("Pornim demonstrația MinIO...");

    try {
        const minioClient = new Minio.Client(minioConfig);
        console.log("Conectat la MinIO.");

        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            console.log(`Bucket-ul "${bucketName}" nu există. Îl creăm acum...`);
            await minioClient.makeBucket(bucketName, 'us-east-1');
            console.log(`Bucket-ul "${bucketName}" a fost creat.`);
        } else {
            console.log(`Bucket-ul "${bucketName}" există deja.`);
        }
        
        fs.writeFileSync(filePath, 'Acesta este un fișier de test generat automat.');
        console.log(`Am creat un fișier local de test: "${fileName}"`);

        const metaData = { 'Content-Type': 'text/plain' };
        console.log(`Se încarcă fișierul în MinIO...`);
        await minioClient.fPutObject(bucketName, fileName, filePath, metaData);
        console.log(`Succes! Fișierul a fost încărcat ca "${fileName}" în bucket-ul "${bucketName}".`);
        console.log("Poți verifica fișierul în consola MinIO: http://localhost:9001");

    } catch (err) {
        console.error("A apărut o eroare:", err);
    }
}

runDemo();