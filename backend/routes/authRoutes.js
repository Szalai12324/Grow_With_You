import express from 'express';
import User from '../models/user.js';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {

    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Ez az e-mail cím már használatban van." });
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword });
            res.status(201).json({ message: "Sikeres regisztráció!", user: newUser });
        }
    } catch (error) {
        console.error("Hiba történt a regisztráció során:", error);
        res.status(500).json({ error: "Hiba történt a regisztráció során." });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Megkeressük a felhasználót e-mail alapján
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "Hibás e-mail cím vagy jelszó!" });
        }

        // 2. Összehasonlítjuk a beírt jelszót a titkosítottal
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Hibás e-mail cím vagy jelszó!" });
        }

        // 3. JWT Token generálása (Belecsomagoljuk a legfontosabb adatokat!)
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role, 
                subscriptionTier: user.subscriptionTier 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // 1 napig érvényes a bejelentkezés
        );

        // 4. Visszaküldjük a tokent és a user adatait (jelszó NÉLKÜL!)
        res.status(200).json({
            message: "Sikeres bejelentkezés!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscriptionTier: user.subscriptionTier
            }
        });
    } catch (error) {
        console.error("Hiba a bejelentkezés során:", error);
        res.status(500).json({ error: "Szerverhiba a bejelentkezés során." });
    }
});

export default router;