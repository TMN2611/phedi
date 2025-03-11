const mongoose = require('mongoose');

async function connect() {
  const DB_URL = process.env.MONGODB_CONECT || 'mongodb+srv://phedi:MK2T1kqJiGo8yqj6@cluster0.jnbad.mongodb.net/phedi?retryWrites=true&w=majority';

  
  try {
    await mongoose.connect(DB_URL);

    console.log('Connect successfully');
  } catch (error) {
    console.log('Connect failure');
  }
}
module.exports = { connect };
