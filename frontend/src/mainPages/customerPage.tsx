import React from "react";

import './customerPage.css';
import ShowProduct from "../customerPageComponents/showProduct";
import Navbar from "../sidebars/customerNavbar";

type MenuItem = 'Kezdőlap' | 'Termékek' | 'Rólunk' | 'Kapcsolat';

const CustomerPage: React.FC = () => {

    const [selectedMenu, setSelectedMenu] = React.useState<MenuItem>('Kezdőlap');

    const renderContent = () => {
        switch (selectedMenu) {
            case 'Kezdőlap':
                return <div>Kezdőlap tartalma</div>;
            case 'Termékek':
                return <ShowProduct/>;
            case 'Rólunk':
                return <div>Rólunk tartalma</div>;
            case 'Kapcsolat':
                return <div>Kapcsolat tartalma</div>;
        }
    };

    return (
        <div className="customer-page">
            <Navbar onSelect={(item) => setSelectedMenu(item)} selected={selectedMenu} />
            <div className="content">
                {renderContent()}
            </div>
        </div>
    );
}

export default CustomerPage;