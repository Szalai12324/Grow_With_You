import React from "react";
import { PREDEFINED_COLORS } from "../universalComponents/colors";
import { useState } from "react";
import './filterProduct.css';

interface Filter {
    color: string | undefined;
    gender: string | undefined;
    type: string | undefined;
    size: string | undefined;
    minPrice: number | undefined;
    maxPrice: number | undefined;   
}

interface FilterProductProps {
    onFilterResult: (filteredProducts: any[]) => void;
}

const FilterProduct: React.FC<FilterProductProps> = ({ onFilterResult }) => {

    const [filter, setFilter] = useState<Filter>({
        color: undefined,
        gender: undefined,
        type: undefined,
        size: undefined,
        minPrice: undefined,
        maxPrice: undefined
    });

    const handleFilterChange = (key: keyof Filter, value: any) => {
        setFilter(prev => ({
            ...prev,
            [key]: prev[key] === value ? undefined : value
        }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'minPrice' | 'maxPrice') => {
        const value = e.target.value;
        setFilter(prev => ({ ...prev, [type]: value ? Number(value) : undefined }));
    };

    const applyFilters = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/products/filter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filter)
            });
            if (response.ok) {
                const data = await response.json();
                // Átadjuk az eredményt a szülő komponensnek!
                onFilterResult(data); 
            }
        } catch (error) {
            console.error('Error fetching filtered products:', error);
        }
    };

    return(<div className="filter-sidebar">
            <h3>KERESÉS & SZŰRÉS</h3>
            
            {/* 1. Keresés */}
            <div className="filter-section">
                <input 
                    type="text" 
                    placeholder="Keresés..." 
           
                />
            </div>

            {/* 2. Kategóriák (Type) */}
            <div className="filter-section">
                <h4>CATEGORIES</h4>
                <div className="category-grid">
                    <button onClick={() => handleFilterChange('type', 'dress')} className={filter.type === 'dress' ? 'active' : ''}>Dresses</button>
                    <button onClick={() => handleFilterChange('type', 'top')} className={filter.type === 'top' ? 'active' : ''}>Tops</button>
                    {/* ... többi kategória ... */}
                </div>
            </div>

            {/* 3. Gender */}
            <div className="filter-section">
                <h4>GENDER</h4>
                <div className="gender-flex">
                    <button onClick={() => handleFilterChange('gender', 'boy')} className={filter.gender === 'boy' ? 'active' : ''}>Boys</button>
                    <button onClick={() => handleFilterChange('gender', 'girl')} className={filter.gender === 'girl' ? 'active' : ''}>Girls</button>
                    <button onClick={() => handleFilterChange('gender', 'unisex')} className={filter.gender === 'unisex' ? 'active' : ''}>Neutral</button>
                </div>
            </div>

            {/* 4. Színek (A PREDEFINED_COLORS listából generálva) */}
            <div className="filter-section">
                <h4>COLORS</h4>
                <div className="color-grid">
                    {PREDEFINED_COLORS.map(c => (
                        <button 
                            key={c.hex} 
                            style={{ 
                                backgroundColor: c.hex,
                                border: filter.color === c.hex ? '3px solid #000' : '1px solid #ccc' 
                            }}
                            className="filter-color-btn"
                            onClick={() => handleFilterChange('color', c.hex)}
                            title={c.name}
                        />
                    ))}
                </div>
            </div>

            {/* 5. Ársáv */}
            <div className="filter-section">
                <h4>PRICE RANGE</h4>
                <div className="price-inputs">
                    <input type="number" placeholder="5000 Ft" onChange={(e) => handlePriceChange(e, 'minPrice')} />
                    <span> - </span>
                    <input type="number" placeholder="25000 Ft" onChange={(e) => handlePriceChange(e, 'maxPrice')} />
                </div>
            </div>

            {/* 6. Szűrés gomb */}
            <button className="submit-filter-btn" onClick={applyFilters}>Szűrés</button>
        </div>
        );
};

export default FilterProduct;