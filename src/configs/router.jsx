import { Routes, Route } from "react-router-dom";
import Home from '../components/pages/home/Home';
import Product from '../components/pages/product/Product'
import AdminMain from '../components/pages/admin/admin-main/AdminMain';
import History from '../components/pages/history/History';
import Auth from '../components/pages/auth/Auth'

export default function Router() {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    const isLoggedIn = localStorage.getItem('userKey') !== null && user?.user
    const isAdmin = Boolean(user?.user?.admin)

    return (
        <Routes>
            {isLoggedIn ? (
                <>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Product />} />
                    {isAdmin ? <Route path="/admin" element={<AdminMain />} /> : ''}
                    {isAdmin ? <Route path="/histories" element={<History />} /> : ''}
                </>
            ) : (
                <Route path="/" element={<Auth />} />
            )}
            
        </Routes>
    )
}
