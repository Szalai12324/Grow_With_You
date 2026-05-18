import React from 'react';
import './adminSidebar.css';
import { FiChevronRight } from 'react-icons/fi';


type MenuItem = 'Statisztikák' | 'Termékek' | 'Rendelések';

interface SidebarProps {
  onSelect: (item: MenuItem) => void;
  selected: MenuItem;
}


const Sidebar: React.FC<SidebarProps> = ({onSelect,selected}) => {
    return (
        <div className="sidebar"> 
             
            
            <ul>
                <div className='menu-items'>
                    <li  
                        className={selected === 'Statisztikák' ? 'active' : ''}
                        onClick={() => onSelect('Statisztikák')}>Statisztikák
                    </li>
                </div>
                <div className='menu-items'>
                    <li 
                        className={selected === 'Termékek' ? 'active' : ''}
                        onClick={() => onSelect('Termékek')}>Termékek
                    </li>
                </div> 
                <div className='menu-items'>
                    <li 
                        className={selected === 'Rendelések' ? 'active' : ''}
                        onClick={() => onSelect('Rendelések')}>Rendelések
                    </li>
                </div> 
            </ul>
            <button 
                className="toggle-btn" 
                
                >
                <FiChevronRight  size={18} />

            </button>
        </div>
    );
}

export default Sidebar;