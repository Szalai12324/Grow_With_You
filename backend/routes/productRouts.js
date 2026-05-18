import express from 'express';
import Product from '../models/products.js';
import upload from '../imageConfig.js';
import { Op, where, cast, col } from 'sequelize';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

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




router.post('/filter', async (req, res) => {
  const { type, gender, color, size, minPrice, maxPrice } = req.body;

  // A queryObject-ben tároljuk az "egyszerű" szűrőket
  const queryObject = {};
  
  // Egy külön tömböt készítünk az "and" (és) feltételeknek, ahova a bonyolultabb JSON szűrők is bekerülnek
  const andConditions = [];

  // 1. Egyszerű, pontos egyezések (Ezek mehetnek a queryObject-be)
  if (type && type !== 'undefined') queryObject.type = type;
  if (gender && gender !== 'undefined') queryObject.gender = gender;
  
  if (minPrice && minPrice !== 'undefined') {
      queryObject.price = { ...queryObject.price, [Op.gte]: Number(minPrice) };
  }
  if (maxPrice && maxPrice !== 'undefined') {
      queryObject.price = { ...queryObject.price, [Op.lte]: Number(maxPrice) };
  }

  // Ha vannak egyszerű feltételeink, azokat belerakjuk a közös listába
  if (Object.keys(queryObject).length > 0) {
      andConditions.push(queryObject);
  }

  // 🚀 2. A Bonyolult JSON keresések (A varázslat itt van!)
  // A Sequelize 'where' funkciójával rákényszerítjük a Postgres-t, 
  // hogy a JSON oszlopot szövegként (text) kezelje a keresés idejére!
  
  if (color && color !== 'undefined') {
      andConditions.push(
          where(
              cast(col('color'), 'TEXT'), 
              { [Op.like]: `%${color}%` }       
          )
      );
  }
  
  if (size && size !== 'undefined') {
      andConditions.push(
          where(
              cast(col('size'), 'TEXT'),  
              { [Op.like]: `%${size}%` }
          )
      );
  }

  try {
    // Ha van egyáltalán valamilyen szűrőfeltétel (andConditions nem üres), 
    // akkor azokat egy nagy [Op.and] blokkba tesszük. Ha nincs, akkor sima üres {} objektumot adunk át (tehát minden terméket lekér).
    const finalWhere = andConditions.length > 0 ? { [Op.and]: andConditions } : {};
    
    const products = await Product.findAll({ where: finalWhere });
    res.status(200).json(products);
  } catch (error) {
    console.error("Hiba történt a termékek szűréskor:", error);
    res.status(500).json({ error: "Hiba történt a termékek szűréskor." });
  }
});

export default router;
