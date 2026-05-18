import React from "react";
import { useEffect } from "react";
import './showProductAdmin.css';
import DeleteButton from "../universalComponents/deleteButton";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    color: string;
    size: string;
    stock: number;
    imageUrls: string[];

}

const ShowProductAdmin: React.FC = () => {

    const [products, setProducts] = React.useState<Product[]>([]);

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

    return (
        <div className="admin-table-container">
            <table className="admin-product-table">
                <thead>
                    <tr>
                        <th>Kép</th>
                        <th>Cikkszám</th>
                        <th>Név & Leírás</th>
                        <th>Ár</th>
                        <th>Szín</th>
                        <th>Méret</th>
                        <th>Készlet</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>
                                
                            <a 
                                href={getFirstImageUrl(product.imageUrls)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}
                            >
                                🔗 Kép megnyitása
                            </a>
                            </td>
                            <td><strong>{product.sku}</strong></td>
                            <td>
                                <div className="admin-product-name">{product.name}</div>
                                
                                <div className="admin-product-desc">
                                    {product.description.substring(0, 40)}...
                                </div>
                            </td>
                            <td className="admin-price">{product.price} Ft</td>
                            <td>{product.color}</td>
                            <td>{product.size}</td>
                            <td>
                                <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    {product.stock} db
                                </span>
                            </td>
                            <td>
                                <DeleteButton id={product.id} 
                                onDelete={() => setProducts(products.filter(p => p.id !== product.id))}
                                /> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ShowProductAdmin;