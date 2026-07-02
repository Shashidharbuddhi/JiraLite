import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import seedPlatformAdmin from './utils/seedPlatformAdmin.js';

dotenv.config();

const startServer = async () => {
  await connectDB();
  await seedPlatformAdmin();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server Working in Port ${PORT}`);
  });
};

startServer();
