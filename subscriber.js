const amqp = require('amqplib');
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1/data_tamu', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const DataSchema = new mongoose.Schema({
  id: String,
  nama: String,
  email: String,
  phoneNumber: String,
  instansi: String,
  deskripsi: String,
});

const DataModel = mongoose.model('Data', DataSchema);

const RMQ_URL = 'amqp://smkn13bandung:qwerty@rmq2.pptik.id:5672//smkn13bandung';
const QUEUE_NAME = 'Log';


async function main() {
  const channel = await connectToRMQ();

  channel.consume(QUEUE_NAME, async (msg) => {
    const content = JSON.parse(msg.content.toString());
    await processMessage(content);
    channel.ack(msg);
  }, { noAck: false });
}

async function connectToRMQ() {
  const connection = await amqp.connect(RMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);

  return channel;
}

async function processMessage(message) {
  console.log('Received message:', message);

  if (message.operation === 'create') {
    await createData(message.data);
  } else if (message.operation === 'update') {
    await updateData(message.data);
  } else if (message.operation === 'delete') {
    await deleteData(message.id);
  }
}

async function createData(data) {
  try {
    const newData = new DataModel({
      id: data.id,
      nama: data.nama,
      email: data.email,
      phoneNumber: data.phoneNumber,
      instansi: data.instansi,
      deskripsi: data.deskripsi,
    });
    await newData.save();
    console.log('Data created:', newData);
  } catch (error) {
    console.error('Error creating data:', error.message);
  }
}

async function updateData(data) {
  try {
    const updatedData = await DataModel.findOneAndUpdate(
      { id: data.id },
      { $set: data },
      { new: true }
    );
    console.log('Data updated:', updatedData);
  } catch (error) {
    console.error('Error updating data:', error.message);
  }
}

async function deleteData(id) {
  try {
    const deletedData = await DataModel.findOneAndDelete({ id });
    console.log('Data deleted:', deletedData);
  } catch (error) {
    console.error('Error deleting data:', error.message);
  }
}

main();
