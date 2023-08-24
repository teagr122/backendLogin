const mongoose = require('mongoose');

// Set up MongoDB connection
mongoose.connect('mongodb://127.0.0.1/data_tamu', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const DataModel = mongoose.model('Data', {
  id: String,
  nama: String,
});

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

module.exports = {
  processMessage,
};
