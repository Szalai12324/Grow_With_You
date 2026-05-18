import React, { useState } from 'react';

import '../mainPages/adminPage.css';

interface CollapsibleCardProps {
    title: string;
    children: React.ReactNode;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="collapsible-card">
            <div className="collapsible-header" onClick={() => setIsOpen(!isOpen)}>
                <h3>{title}</h3>
                <span className={`arrow ${isOpen ? 'open' : ''}`}>
                    {isOpen ? '▲' : '▼'}
                </span>
            </div>
            
            {isOpen && (
                <div className="collapsible-body">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleCard;