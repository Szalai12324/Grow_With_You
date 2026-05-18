import React from "react";
import Sidebar from "../sidebars/adminSidebar";
import './adminPage.css';
import ProductUpload from "../adminPageComponents/productUpload";
import ShowProductAdmin from "../adminPageComponents/showProductAdmin";
import CollapsibleCard from "../universalComponents/collapsibleCard";

type MenuItem = 'Statisztikák' | 'Termékek' | 'Rendelések';

const AdminPage: React.FC = () => {

    const [selectedMenu, setSelectedMenu] = React.useState<MenuItem>('Statisztikák');

    const renderContent = () => {
        switch (selectedMenu) {
            case 'Statisztikák':
                return <div>Statisztikák tartalma</div>;
            case 'Termékek':
                return (
                <div className="products-manager">

                    <h2>Termékek Kezelése</h2>

                    <CollapsibleCard title="Termék feltöltése">
                        <ProductUpload />
                    </CollapsibleCard>

                    <CollapsibleCard title="Termékek megtekintése">
                        <ShowProductAdmin />
                    </CollapsibleCard>
                </div>
                );
            case 'Rendelések':
                return <div>Rendelések tartalma</div>;
        }
    };

    return (
        <div className="admin-page">
            <Sidebar onSelect={(item) => setSelectedMenu(item)} selected={selectedMenu} />
            <div className="content">
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminPage;