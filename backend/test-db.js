const mongoose = require('mongoose');

async function testConn() {
  const uri = 'mongodb+srv://mohammedsajad52241_db_user:EhEy4gz03pqx8JXN@cluster0.mongodb.net/easymart?retryWrites=true&w=majority';
  console.log('Testing connection to:', uri);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('CONNECTED SUCCESSFULLY to MongoDB Atlas!');
    process.exit(0);
  } catch (err) {
    console.log('Connection failed:', err.message);
    process.exit(1);
  }
}
testConn();
