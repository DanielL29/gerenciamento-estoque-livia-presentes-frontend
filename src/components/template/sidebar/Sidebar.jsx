import SidebarRoutes from '../sidebar-routes/SidebarRoutes'
import './Sidebar.css'

export default function Sidebar() {
    const user = JSON.parse(localStorage.getItem('currentUser'))

    function logOut() {
        localStorage.clear()
        window.location.reload()
    }

    return (
        <aside className="aside">
            <div className="routes">
                <SidebarRoutes path="/" routeName="Home" icon="home-sharp" />
                <SidebarRoutes path="/products" routeName="Produtos" icon="bag-handle" />
                {user.user.admin ? <SidebarRoutes path="/admin" routeName="Gerenciar Tabelas" icon="settings-sharp" /> : ''}
                {user.user.admin ? <SidebarRoutes path="/histories" routeName="Histórico Pedidos" icon="receipt" /> : ''}
            </div>
            <div className="logout" onClick={logOut}>
                <SidebarRoutes path="/" routeName="Sair" icon="log-out-outline" />    
            </div>
        </aside>
    )
}