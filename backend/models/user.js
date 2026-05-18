import { DataTypes } from 'sequelize';
import { sequelize } from '../init_db.js'; // A saját adatbázis konfigurációd útvonala

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // --- BEJELENTKEZÉSI ADATOK ---
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Biztosítja, hogy egy e-mail címmel csak egyszer lehessen regisztrálni
        validate: {
            isEmail: true // Nem enged be menteni hibás formátumú e-mailt
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false // Ide majd a Bcrypt-tel LEKÓDOLT (hash-elt) jelszó fog kerülni!
    },
    // --- JOGOSULTSÁGOK (A múltkori terv alapján) ---
    role: {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        defaultValue: 'USER',
        allowNull: false
    },
    subscriptionTier: {
        type: DataTypes.ENUM('NONE', 'TIER_1', 'TIER_2', 'TIER_3'),
        defaultValue: 'NONE',
        allowNull: false
    },
    subscriptionExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true // Automatikusan létrehozza a createdAt és updatedAt mezőket
});

export default User;