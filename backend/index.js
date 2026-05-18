import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './init_db.js'; 
import Product from './models/products.js'; 
import User from './models/user.js';
import productRoutes from './routes/productRouts.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000; 


app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.send('A szerver működik!');
});


async function startServer() {
  try {
    
    await sequelize.sync({ alter: true}); 
    console.log("✅ Az adatbázis szinkronizálva.");

    
    app.listen(port, () => {
      console.log(`🚀 A szerver fut a ${port}-es porton!`);
    });

  } catch (error) {
    console.error("❌ Hiba történt a szerver indításakor:", error);
  }
}

startServer();