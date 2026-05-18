import React, { useState } from "react";
import { PREDEFINED_COLORS } from "../universalComponents/colors";
import './productUpload.css'; 

const ProductUpload: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        gender: 'unisex',
        sku: '',
        type: ''
    });

    const [colors, setColors] = useState<string[]>([]);
    const [stockVariants, setStockVariants] = useState<{ [key: string]: number }>({});
    const [currentSize, setCurrentSize] = useState('');
    const [currentStock, setCurrentStock] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const toggleColor = (e: React.MouseEvent, hex: string) => {
        e.preventDefault(); 
        if (colors.includes(hex)) {
            
            setColors(colors.filter(c => c !== hex));
        } else {
            
            setColors([...colors, hex]);
        }
    };

    const handleAddVariant = (e: React.MouseEvent) => {

        e.preventDefault();

        if (currentSize && currentStock) {

            setStockVariants({...stockVariants,[currentSize.toUpperCase()]: parseInt(currentStock, 10)});

            setCurrentSize('');
            setCurrentStock('');

        }

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        const submitData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });

        submitData.append('color', JSON.stringify(colors));
        submitData.append('size', JSON.stringify(Object.keys(stockVariants))); 
        submitData.append('stock', JSON.stringify(stockVariants));

        
        images.forEach((image) => {
            submitData.append('images', image); 
        });

        try {
            const response = await fetch('http://localhost:5001/api/products/create', {
                method: 'POST',
                body: submitData, 
                
            });

            if (response.ok) {
                    const result = await response.json();
                    console.log('Sikeres mentés:', result);
                    
                    showNotification('A termék sikeresen feltöltve az adatbázisba!', 'success');
                    // Űrlap kiürítése sikeres mentés után
                    setFormData({ name: '', description: '', price: '', sku: '', type: '', gender: 'unisex' });
                    setColors([]);
                    setStockVariants({});
                    setImages([]);
                    setImages([]);
                } else {
                    console.log('Hiba történt a feltöltés során!');
                    showNotification('Hiba történt a termék feltöltése során!', 'error');
                }
        } catch (error) {
            console.error('Hálózati hiba:', error);
            console.log('Nem sikerült csatlakozni a szerverhez!');
            showNotification('Nem sikerült csatlakozni a szerverhez!', 'error');
        }
    };
     

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
    
    setNotification({ show: true, message, type });
    
    
    setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
    }, 3000);
};

    return (
        <div className="product-upload-container">
            <h2 className="product-upload-title">Új termék feltöltése</h2>

            {notification.show && (
                <div className={`custom-notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            
            <form className="product-upload-form" onSubmit={handleSubmit}>
                
                <div className="form-group">
                    <label>Termék neve</label>
                    <input type="text" name="name" className="form-input" placeholder="Pl.: Fekete pamut póló" value={formData.name} onChange={handleTextChange} required />
                </div>

                <div className="form-group">
                    <label>Leírás</label>
                    <textarea name="description" className="form-textarea" placeholder="Termék részletes leírása..." value={formData.description} onChange={handleTextChange} />
                </div>

                <div className="form-row">
                    <div className="form-group half-width">
                        <label>Ár (Ft)</label>
                        <input type="number" name="price" className="form-input" placeholder="0" value={formData.price} onChange={handleTextChange} required />
                    </div>
                    <div className="form-group half-width">
                        <label>SKU (Cikkszám)</label>
                        <input type="text" name="sku" className="form-input" placeholder="Pl.: POLO-001" value={formData.sku} onChange={handleTextChange} required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group half-width">
                        <label>Kinek (Gender)</label>
                        <select name="gender" className="form-input" value={formData.gender} onChange={handleTextChange}>
                            <option value="unisex">Unisex</option>
                            <option value="boy">Fiú (Boy)</option>
                            <option value="girl">Lány (Girl)</option>
                        </select>
                    </div>
                    <div className="form-group half-width">
                        <label>Típus (Type)</label>
                        <input type="text" name="type" className="form-input" placeholder="Pl.: dress, tshirt, pants" value={formData.type} onChange={handleTextChange} required />
                    </div>
                </div>

                {/* 🚀 ÚJ: Interaktív, kattintható színpaletta */}
                <div className="form-group">
                    <label>Színek kiválasztása (Kattints a megfelelőkre)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                        {PREDEFINED_COLORS.map((colorObj, index) => {
                            const isSelected = colors.includes(colorObj.hex);
                            return (
                                <button
                                    key={index}
                                    onClick={(e) => toggleColor(e, colorObj.hex)}
                                    title={colorObj.name} // Rámutatáskor kiírja a szín nevét
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '50%',
                                        backgroundColor: colorObj.hex,
                                        cursor: 'pointer',
                                        border: isSelected ? '4px solid #10b981' : '1px solid #d1d5db',
                                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'all 0.2s ease',
                                        boxShadow: isSelected ? '0 4px 10px rgba(16, 185, 129, 0.3)' : 'none'
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="form-group">
                    <label>Méretek és Készlet hozzáadása</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" className="form-input" placeholder="Méret (pl. S, 42)" value={currentSize} onChange={(e) => setCurrentSize(e.target.value)} />
                        <input type="number" className="form-input" placeholder="Darab" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} />
                        <button onClick={handleAddVariant} className="submit-button" style={{ padding: '0 20px', width: 'auto' }}>Hozzáadás</button>
                    </div>
                    {Object.keys(stockVariants).length > 0 && (
                        <ul style={{ marginTop: '10px', listStyleType: 'none', padding: 0 }}>
                            {Object.entries(stockVariants).map(([size, stock], i) => (
                                <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '15px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>{size}</span> méret — <span style={{ fontWeight: 'bold' }}>{stock}</span> db készleten
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="form-group">
                    <label>Képek feltöltése</label>
                    <input type="file" multiple className="file-input" onChange={handleImageChange} />
                </div>

                {images.length > 0 && (
                    <div className="image-preview-list">
                        <p>Kiválasztott fájlok:</p>
                        <ul>
                            {images.map((img, index) => (
                                <li key={index}>📎 {img.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <button type="submit" className="submit-button" style={{ marginTop: '20px' }}>Feltöltés mentése</button>
            </form>
        </div>
    );
}

export default ProductUpload;