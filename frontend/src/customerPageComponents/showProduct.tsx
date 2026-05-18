import React, { useState, useEffect } from "react";
import './showProduct.css';
import { Link } from "react-router-dom";
import FilterProduct from "./filterProduct";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    color: string | string[];
    gender: string;   
    type: string;
    size: any;
    stock: any;
    imageUrls: string[];

}

const ShowProduct: React.FC = () => {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/products/all');
                if(response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
                
            } catch (error) {
                console.error('Hiba a termék lekérdezésekor:', error);
            }
        };

        fetchProducts();
    }, []);

    const getFirstImageUrl = (imageUrls: any) => {
        
        if (!imageUrls || imageUrls.length === 0) {
            return 'https://via.placeholder.com/300x300?text=Nincs+kép';
        }

        let firstImage = imageUrls[0];

        firstImage = firstImage.replace(/\\/g, '/');

        return `http://localhost:5001/${firstImage}`;
    };

    const parseColors = (colorData: any): string[] => {
        if (!colorData) return [];
        // Ha már egy eleve jól formázott tömb (array), visszaadjuk
        if (Array.isArray(colorData)) return colorData;
        // Ha "szövegesített" JSON (pl. MySQL vagy SQLite mentés miatt), kicsomagoljuk
        try {
            return JSON.parse(colorData);
        } catch (e) {
            console.error("Nem sikerült beolvasni a színeket:", e);
            return [];
        }
    };

    return (
        <div className="product-page-layout">
            
            {/* BAL OLDAL: A Szűrő */}
            <FilterProduct onFilterResult={(filteredData) => setProducts(filteredData)} />

            {/* JOBB OLDAL: A Termékrács */}
            <div className="customer-product-container">
                <h2 className="customer-product-title">Legújabb darabok</h2>
                
                {/* Üres állapot (Empty State) kezelése */}
                {products.length === 0 ? (
                    <div className="empty-state-message">
                        <h3>Sajnos nem találtunk a keresésnek megfelelő terméket. 😔</h3>
                        <p>Próbáld meg lazítani a szűrőfeltételeket, vagy törölni néhányat!</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <div key={product.id} className="product-card">
                                
                                <div className="product-image-wrapper">
                                    <img 
                                        src={getFirstImageUrl(product.imageUrls)} 
                                        alt={product.name} 
                                        className="product-image"
                                    />
                                </div>
                                
                                <div className="product-info-row">
                                    <h3 className="product-name">{product.name}</h3>
                                    <span className="product-price">{product.price} Ft</span>
                                </div>
                                
                                <div className="product-colors">
                                    {parseColors(product.color).map((hexCode, index) => (
                                        <span 
                                            key={index} 
                                            className="color-swatch" 
                                            style={{ 
                                                backgroundColor: hexCode,
                                                // Ezt kivételesen benne hagytam, mert ez tisztán logikai: a fehér kapjon keretet. 
                                                // Ha akarod, ezt is ki lehet vinni egy class-ba!
                                                border: hexCode.toLowerCase() === '#ffffff' ? '1px solid #ccc' : 'none'
                                            }}
                                        ></span>
                                    ))}
                                </div>
                                
                                <Link to={`/product/${product.id}`} className="add-to-cart-btn">
                                    <span className="btn-text">Megnézem</span>
                                </Link>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShowProduct;