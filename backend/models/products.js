import { DataTypes } from 'sequelize';
import { sequelize } from '../init_db.js';

const Product = sequelize.define('Product', {
  
  name: {
    type: DataTypes.STRING, 
    allowNull: false        
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true            
  },
  color: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  size: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  gender: {
    type: DataTypes.ENUM('boy', 'girl', 'unisex'),
    allowNull: false,
    defaultValue: 'unisex' // Érdemes egy alapértelmezett értéket adni
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stock: {
    type: DataTypes.JSON,
    defaultValue: {}         
  },
  imageUrls: {
    type: DataTypes.JSON, 
    allowNull: true, 
    defaultValue: [] 
  }
});

export default Product;