import React from 'react';
import './customerNavbar.css'; 
import { FiSearch, FiUser, FiHeart, FiShoppingCart } from 'react-icons/fi';

// 🚀 1. Pontosan azokat a menüpontokat definiáljuk, amiket a CustomerPage vár
type MenuItem = 'Kezdőlap' | 'Termékek' | 'Rólunk' | 'Kapcsolat';

// 🚀 2. Visszatettük a Props-okat, hogy tudjon beszélgetni a szülővel!
interface NavbarProps {
    onSelect: (item: MenuItem) => void;
    selected: MenuItem;
}

const Navbar: React.FC<NavbarProps> = ({ onSelect, selected }) => {
    return (
        <nav className="navbar-container">
            
            <div className="navbar-logo">
                <span className="logo-text">Grow with You</span>
            
            </div>

            <ul className="navbar-links">
                {/* 🚀 3. Itt dől el a varázslat: Ha ráklikkel, szól a Főnöknek (onSelect), és ha ő van kiválasztva, kap egy 'active' osztályt! */}
                <li 
                    className={selected === 'Kezdőlap' ? 'active' : ''}
                    onClick={() => onSelect('Kezdőlap')}
                >
                    Kezdőlap
                </li>
                <li 
                    className={selected === 'Termékek' ? 'active' : ''}
                    onClick={() => onSelect('Termékek')}
                >
                    Termékek
                </li>
                <li 
                    className={selected === 'Rólunk' ? 'active' : ''}
                    onClick={() => onSelect('Rólunk')}
                >
                    Rólunk
                </li>
                <li 
                    className={selected === 'Kapcsolat' ? 'active sale-text' : 'sale-text'}
                    onClick={() => onSelect('Kapcsolat')}
                >
                    Kapcsolat
                </li>
            </ul>

            <div className="navbar-icons">
                <button aria-label="Keresés"><FiSearch /></button>
                <button aria-label="Profil"><FiUser /></button>
                <button aria-label="Kedvencek"><FiHeart /></button>
                <div className="cart-container">
                    <button aria-label="Kosár"><FiShoppingCart /></button>
                    <span className="cart-badge">3</span>
                </div>
            </div>

        </nav>
    );
};

export default Navbar;