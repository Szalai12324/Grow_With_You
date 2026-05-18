import express from 'express';
import Product from '../models/products.js';
import upload from '../imageConfig.js';

const router = express.Router();

router.post('/create', upload.array('images', 10), async (req, res) => {
  try {
    const { name, description, price, sku, color, size, stock } = req.body;

    if (!stock || stock === '') stock = 0;
    if (!price || price === '') price = 0;

    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const newProduct = await Product.create({
      name,
      description,
      price,
      sku,
      color,
      size,
      stock,
      imageUrls
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Hiba történt a termék létrehozásakor:", error);
    res.status(500).json({ error: "Hiba történt a termék létrehozásakor." });
  }
});

router.get('/all', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("Hiba történt a termékek lekérésekor:", error);
    res.status(500).json({ error: "Hiba történt a termékek lekérésekor." });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await Product.destroy({ where: { id } });
    res.status(200).json({ message: "Termék törölve.", deleted });
  } catch (error) {
    console.error("Hiba történt a termék törlésekor:", error);
    res.status(500).json({ error: "Hiba történt a termék törlésekor." });
  }
});

router.post('/details', async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findByPk(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Termék nem található." });
    }
  } catch (error) {
    console.error("Hiba történt a termék részleteinek lekérésekor:", error);
    res.status(500).json({ error: "Hiba történt a termék részleteinek lekérésekor." });
  }
});

router.post('filter', async (req, res) => {
  const {type, gender, color, size, minPrice, maxPrice } = req.body;

  const queryObject = {};

  if (type) queryObject.type = type
  if (gender) queryObject.gender = gender
  if (color) queryObject.color = color
  if (size) queryObject.size = size
  if (minPrice) queryObject.price = { ...queryObject.price, [Op.gte]: minPrice }
  if (maxPrice) queryObject.price = { ...queryObject.price, [Op.lte]: maxPrice }

  try {
    const products = await Product.findAll({ where: queryObject });
    res.status(200).json(products);
  } catch (error) {
    console.error("Hiba történt a termékek szűréskor:", error);
    res.status(500).json({ error: "Hiba történt a termékek szűréskor." });
  }
});

export default router;
