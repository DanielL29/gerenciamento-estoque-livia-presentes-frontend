import Layout from "../../../template/layout/Layout";
import AdminCategories from "../AdminCategories";
import AdminClients from "../AdminClients";
import AdminProducts from "../AdminProducts";
import AdminUsers from "../AdminUsers";
import './AdminMain.css'

export default function AdminMain() {
    return (
        <Layout title="Gerenciar Tabelas e Produtos" subtitle="Pagina para gerenciar cada produto, cliente, categoria/marca e usuários" icon="settings-sharp">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="product-tab" data-bs-toggle="tab" data-bs-target="#product" type="button" role="tab" aria-controls="product" aria-selected="true">Produtos</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="category-tab" data-bs-toggle="tab" data-bs-target="#category" type="button" role="tab" aria-controls="category" aria-selected="false">Categorias/Marcas</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="client-tab" data-bs-toggle="tab" data-bs-target="#client" type="button" role="tab" aria-controls="client" aria-selected="false">Clientes</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="user-tab" data-bs-toggle="tab" data-bs-target="#user" type="button" role="tab" aria-controls="user" aria-selected="false">Usuários</button>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="product" role="tabpanel" aria-labelledby="product-tab">
                    <AdminProducts />
                </div>
                <div className="tab-pane fade" id="category" role="tabpanel" aria-labelledby="category-tab">
                    <AdminCategories />
                </div>
                <div className="tab-pane fade" id="client" role="tabpanel" aria-labelledby="client-tab">
                    <AdminClients />
                </div>
                <div className="tab-pane fade" id="user" role="tabpanel" aria-labelledby="user-tab">
                    <AdminUsers />
                </div>
            </div>
        </Layout>
    )
}