import jwt from 'jsonwebtoken';

// 1. ŐR: Ellenőrzi, hogy a felhasználó be van-e jelentkezve (van-e érvényes tokenje)
export const verifyToken = (req, res, next) => {
    // A React a header-ben fogja küldeni a tokent így: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ error: "Nincs token megadva!" });

    const token = authHeader.split(' ')[1]; // Lecsípjük a "Bearer " szót

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Érvénytelen vagy lejárt token!" });
        
        // Eltesszük a user adatait a kérésbe (req), hogy a következő őr is lássa
        req.user = decoded; 
        next(); // Továbbengedjük a kérést!
    });
};

// 2. ŐR: Ellenőrzi, hogy a bejelentkezett user ADMIN-e
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "Ehhez a művelethez Admin jogosultság szükséges!" });
    }
    next(); // Ha Admin, mehet tovább!
};