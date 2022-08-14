import { Routes, Route } from "react-router-dom";
import Home from '../components/pages/home/Home';
import Product from '../components/pages/product/Product'
import AdminMain from '../components/pages/admin/admin-main/AdminMain';
import History from '../components/pages/history/History';
import Auth from '../components/pages/auth/Auth'

export default function Router() {
    const user = JSON.parse(localStorage.getItem('currentUser'))

    return (
        <Routes>
            {localStorage.getItem('userKey') !== null ? (
                <>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Product />} />
                    {user.user.admin ? <Route path="/admin" element={<AdminMain />} /> : ''}
                    {user.user.admin ? <Route path="/histories" element={<History />} /> : ''}
                </>
            ) : (
                <Route path="/" element={<Auth />} />
            )}
            
        </Routes>
    )
}