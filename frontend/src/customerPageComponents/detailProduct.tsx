import React from "react";
import { useState, useEffect } from "react";
import { FiChevronDown, FiShoppingCart } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { PREDEFINED_COLORS } from "../universalComponents/colors";
import './detailProduct.css';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    gender: string;
    type: string;
    color: any;
    size: any;
    stock: any;
    imageUrls: string[];
}

const DetailProduct: React.FC = () => {

    const [product, setProduct] = useState<Product | null>(null);
    const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/products/details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: Number(id) })
                });
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                }
            } catch (error) {
                console.error('Hiba a termék részleteinek lekérésekor:', error);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const formatImageUrl = (url: string | undefined) => {

        if (!url) return "https://via.placeholder.com/500x600?text=Termék+képe";
        const cleanUrl = url.replace(/\\/g, '/');
        return `http://localhost:5001/${cleanUrl}`;
    };

    const parseJSON = (data: any, fallback: any) => {
        if (!data) return fallback;
        if (typeof data !== 'string') return data;
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Nem sikerült beolvasni a JSON adatot:", e);
            return fallback;
        }
    };

    const colorsList: string[] = parseJSON(product?.color, []);
    const stockData: Record<string, number> = parseJSON(product?.stock, {});
    const sizesList = Object.keys(stockData);

    const getColorName = (hex: string) => {
        const found = PREDEFINED_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
        return found ? found.name : hex;
    };

    return (
       <div className="product-detail-page">
        <div className="product-detail-card">
            
            {/* BAL OLDAL: Képgaléria (Ez maradt a régi, jól működő kód) */}
            <div className="gallery-section">
                <div className="main-image-container">
                    <img 
                        src={activeImageUrl ? formatImageUrl(activeImageUrl) : formatImageUrl(product?.imageUrls?.[0])} 
                        alt={product?.name || "Termék"} 
                        className="main-image" 
                    />
                </div>
                <div className="thumbnail-list">
                    {product ? product.imageUrls?.map((imageUrl, index) => {
                        const isActive = activeImageUrl === imageUrl || (activeImageUrl === null && index === 0);
                        return (
                            <img 
                                key={index} 
                                src={formatImageUrl(imageUrl)} 
                                className={`thumbnail ${isActive ? 'active' : ''}`} 
                                alt={`Thumb ${index + 1}`} 
                                onClick={() => setActiveImageUrl(imageUrl)} 
                            />
                        );
                    }) : null}
                </div>              
            </div>

            {/* JOBB OLDAL: Termék adatok */}
            <div className="info-section">
                <h1 className="product-title">{product?.name || "Betöltés..."}</h1>
                <h2 className="product-price">{product?.price ? `${product.price} Ft` : ""}</h2>

                {/* Lenyíló leírás (Accordion) */}
                <div className="product-accordion">
                    <div className="accordion-header">
                        <span>TERMÉKLEÍRÁS</span>
                        <FiChevronDown size={20} />
                    </div>
                    <div className="accordion-body">
                        {product?.description || "Nincs elérhető leírás ehhez a termékhez."}
                    </div>
                </div>

                {/* 4. ÚJ: Dinamikus Színválasztó */}
                <div className="options-section">
                    <h3 className="options-title">SZÍNEK</h3>
                    <div className="color-grid">
                        {colorsList.map((hexCode, index) => {
                            const isSelected = selectedColor === hexCode;
                            return (
                                <div 
                                    key={index} 
                                    className="color-item" 
                                    onClick={() => setSelectedColor(hexCode)}
                                >
                                    <div 
                                        className="color-circle" 
                                        style={{
                                            backgroundColor: hexCode,
                                            // Vizuális visszajelzés a kattintásról (Kijelölés kerettel)
                                            border: isSelected ? '3px solid #10b981' : (hexCode.toLowerCase() === '#ffffff' ? '1px solid #ccc' : 'none'),
                                            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                            boxShadow: isSelected ? '0 4px 10px rgba(16, 185, 129, 0.3)' : 'none'
                                        }}
                                    ></div>
                                    <span style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                                        {getColorName(hexCode)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 5. ÚJ: Dinamikus Méret és Készletválasztó */}
                <div className="options-section">
                    <h3 className="options-title">MÉRETEK</h3>
                    <div className="size-grid">
                        {sizesList.map((size) => {
                            const stockCount = stockData[size];
                            const isOutOfStock = stockCount <= 0;
                            const isSelected = selectedSize === size;

                            return (
                                <button 
                                    key={size}
                                    className={`size-btn ${isSelected ? 'active' : ''}`}
                                    disabled={isOutOfStock} // Letiltja a gombot, ha 0 a készlet
                                    onClick={() => setSelectedSize(size)}
                                    style={{
                                        opacity: isOutOfStock ? 0.5 : 1, // Elhalványítja, ha kifogyott
                                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                        backgroundColor: isSelected ? '#34d399' : '#ccfbf1',
                                        color: isSelected ? 'white' : '#047857',
                                        border: isSelected ? '2px solid #059669' : 'none'
                                    }}
                                >
                                    {size}<br/>
                                    <span style={{ fontSize: '11px', fontWeight: 'normal', color: isSelected ? 'white' : '#065f46' }}>
                                        {isOutOfStock ? 'Kifogyott' : `${stockCount} db`}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Kosárba gomb */}
                <button 
                    className="add-to-cart-large"
                    // Később ezt a logikát ráköthetjük a valódi kosárra!
                    onClick={() => {
                        if (!selectedColor || !selectedSize) {
                            alert("Kérlek válassz színt és méretet!");
                        } else {
                            alert(`Kosárba téve: ${product?.name} | Szín: ${getColorName(selectedColor)} | Méret: ${selectedSize}`);
                        }
                    }}
                >
                    <span>Kosárba</span>
                    <FiShoppingCart size={22} />
                </button>
            </div>

        </div>
    </div>
    );
}

export default DetailProduct;