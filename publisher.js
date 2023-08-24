const amqp = require('amqplib');
const readline = require('readline');
const uuid = require('uuid');

const RMQ_URL = 'amqp://smkn13bandung:qwerty@rmq2.pptik.id:5672//smkn13bandung';
const QUEUE_NAME = 'Log';

async function main() {
  const channel = await connectToRMQ();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Pilih operasi (create/update/delete): ', async (operation) => {
    if (operation === 'create') {
      rl.question('Masukkan nama: ', async (nama) => {
        rl.question('Masukkan instansi: ', async (instansi) => {
          rl.question('Masukkan email: ', async (email) => {
            rl.question('Masukkan nomor telepon: ', async (phoneNumber) => {
              rl.question('Masukkan deskripsi: ', async (deskripsi) => {
                const id = uuid.v4().split('-')[1];
                const data = { id, nama, instansi, email, phoneNumber, deskripsi };
                await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ operation: 'create', data })));
                console.log(`Data dengan ID ${id}, nama ${nama}, instansi ${instansi}, email ${email}, nomor telepon ${phoneNumber}, dan deskripsi ${deskripsi} berhasil dikirim ke RabbitMQ.`);
                rl.close();
              });
            });
          });
        });
      });
    } else if (operation === 'update') {
      rl.question('Masukkan ID data yang akan diupdate: ', async (id) => {
        rl.question('Masukkan nama baru: ', async (newNama) => {
          rl.question('Masukkan instansi baru: ', async (newInstansi) => {
            rl.question('Masukkan email baru: ', async (newEmail) => {
              rl.question('Masukkan nomor telepon baru: ', async (newPhoneNumber) => {
                rl.question('Masukkan deskripsi baru: ', async (newDeskripsi) => {
                  await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ operation: 'update', data })));
                  console.log(`Data dengan ID ${id} berhasil diupdate dengan nama baru: ${newNama}, instansi baru: ${newInstansi}, email baru: ${newEmail}, nomor telepon baru: ${newPhoneNumber}, dan deskripsi baru: ${newDeskripsi}`);
                  rl.close();
                });
              });
            });
          });
        });
      });
    } else if (operation === 'delete') {
      rl.question('Masukkan ID data yang akan dihapus: ', async (id) => {
        await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ operation: 'delete', id })));
        console.log(`Data dengan ID ${id} berhasil dihapus.`);
        rl.close();
      });
    } else {
      console.log('Operasi tidak dikenali.');
      rl.close();
    }
  });
}

async function connectToRMQ() {
  const connection = await amqp.connect(RMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);

  return channel;
}

main();
