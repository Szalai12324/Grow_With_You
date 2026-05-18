
import { Navigate, Routes, Route } from 'react-router-dom';
import AdminPage from './mainPages/adminPage';
import CustomerPage from './mainPages/customerPage';
import DetailProduct from './customerPageComponents/detailProduct';



function App() {
  

  return (
    
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/customer" replace />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path='/customer' element={<CustomerPage />}/>
        <Route path="/product/:id" element={<DetailProduct />} />
      </Routes>
    </div>
    
  )
}

export default App
