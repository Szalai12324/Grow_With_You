
import { Navigate, Routes, Route } from 'react-router-dom';
import AdminPage from './mainPages/adminPage';
import CustomerPage from './mainPages/customerPage';
import DetailProduct from './customerPageComponents/detailProduct';
import Login from './authPages/login';
import Register from './authPages/registration';
import ProtectedRoute from './protectedRoute';



function App() {
  

  return (
    
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/customer" replace />} />
       <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        <Route path='/customer' element={<CustomerPage />}/>
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
    
  )
}

export default App
