import { useEffect, useState } from "react";
import ClientDropdown from "../../template/client-dropdown/ClientDropdown";
import Layout from "../../template/layout/Layout";
import ProductCard from "../../template/product-card/ProductCard";
import SmallProductCard from '../../template/small-product-card/SmallProductCard';
import axios from "axios"
import './History.css';
import { BASE_URL } from './../../../index';

export default function History() {
    const [clients, setClients] = useState([])
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [histories, setHistories] = useState([])
    const [searchByCategory, setSearchByCategory] = useState('')
    const filter = searchByCategory === "" ? 
        products.filter(product => product.quantity > 0) : 
        products.filter(product => product.quantity > 0).filter(product => product.categoryId.toString() === searchByCategory)

    useEffect(() => {
        getProducts()
        getClients()
        getCategories()
        getHistories()
    }, [products])

    async function getProducts() {
        const productsData = await axios.get(`${BASE_URL}/products`)
        setProducts(productsData.data)
    }

    async function getClients() {
        const clientsData = await axios.get(`${BASE_URL}/clients`)
        setClients(clientsData.data)
    }

    async function getCategories() {
        const categoriesData = await axios.get(`${BASE_URL}/categories`)
        setCategories(categoriesData.data)
    }

    async function getHistories() {
        const historiesData = await axios.get(`${BASE_URL}/histories`)
        setHistories(historiesData.data)
    }

    function openClientHistory(e) {
        const opened = document.querySelector('.opened')

        if (opened !== null) {
            opened.classList.remove('opened')
        }

        e.target.parentElement.classList.add('opened')
    }

    function createHistory(product, clientId, counter) {

        let month = new Date().getMonth() + 1
        let year = new Date().getFullYear()

        if (month < 10) month = `0${month}`

        let date = `${month}/${year}`

        const history = {
            name: product.name,
            imageUrl: product.imageUrl,
            product: product.product,
            productType: product.productType,
            content: product.content,
            quantity: counter,
            isRefil: product.isRefil,
            refilWarning: product.refilWarning,
            price: product.price,
            priceDate: date,
            relation: categories.filter(category => category._id === product.categoryId)[0].path,
            clientId: clientId
        }

        const promise = axios.post(`${BASE_URL}/histories`, history)
        promise.then(updateQuantity(product, counter))
        promise.catch(res => console.log(res.response.data))
    }

    function updateQuantity(product, counter) {
        let prodObject = { ...product }
        prodObject.quantity = prodObject.quantity - counter

        const promise = axios.put(`${BASE_URL}/products/${product._id}`, prodObject)
        promise.then(res => console.log(res.status))
        promise.catch(res => console.log(res.response.data))
    }

    function updatePaymentCheck(history) {
        let historyObject = { ...history }
        historyObject.confirmPayment = !historyObject.confirmPayment

        const promise = axios.put(`${BASE_URL}/histories/${history._id}`, historyObject)
        promise.then(res => console.log(res.status))
        promise.catch(res => console.log(res.response.data))
    }

    function deleteProdHistory(history) {
        axios.delete(`${BASE_URL}/histories/${history._id}`)
    }

    function loadClientDropdown() {
        return clients.sort((a, b) => a._id - b._id).map(client => {
            return (
                <ClientDropdown key={client._id}
                    clientName={client.name}
                    cpf={client.cpf}
                    address={client.address}
                    cep={client.cep}
                    birthday={client.birthday.split('T')[0].split('-').reverse().splice(0, 2).join('/')}
                    onClick={(e) => openClientHistory(e)}
                >
                    <div className="products">
                        <div className="product-area">
                            <h2>Produtos Disponíveis</h2>
                            <div className="filter-products">
                                <label>Filtrar por Categoria(Marca/Linha)</label>
                                <select value={searchByCategory} onChange={(e) => setSearchByCategory(e.target.value)}>
                                    <option value="" disabled>Pesquise pela Categoria(Marca/Linha)...</option>
                                    <option value="">Todos</option>
                                    {categories.map(category => <option key={category._id} value={category._id}>{category.path}</option>)}
                                </select>
                            </div>
                        </div>
                        {filter.sort((a, b) => a._id - b._id).map(product => {
                            return (
                                <SmallProductCard key={product._id}
                                    productName={product.name}
                                    product={product.product}
                                    productType={product.productType}
                                    relation={categories.map(category => category._id === product.categoryId ? category.path : '')}
                                    quantity={product.quantity}
                                    onClick={(counter) => createHistory(product, client._id, counter)}
                                />
                            )
                        })}
                    </div>
                    <div className="client-history">
                        <h2>Histórico do Cliente</h2>
                        {histories.filter(history => client._id === history.clientId).length === 0 ? (
                            <p>Este cliente ainda não comprou nenhum produto...</p>
                        ) : (
                            histories.filter(history => client._id === history.clientId).sort((a, b) => a._id - b._id).map(history => {
                                return (
                                    <ProductCard key={history._id}
                                        name={history.name}
                                        imageUrl={history.imageUrl}
                                        product={history.product}
                                        productType={history.productType}
                                        relation={history.relation}
                                        quantity={history.quantity}
                                        content={history.content}
                                        payed={history.confirmPayment}
                                        onClick={() => updatePaymentCheck(history)}
                                        delete={() => deleteProdHistory(history)}
                                        isRefil={history.isRefil}
                                        refilWarning={history.refilWarning}
                                        price={history.price}
                                        priceDate={history.priceDate}
                                        isHistory
                                    />
                                )
                            })
                        )}
                    </div>
                </ClientDropdown>
            )
        })
    }

    return (
        <Layout title="Histórico de Pedidos" subtitle="Historico de compras dos produtos categorizado por compras feitas pelos clientes" icon="receipt">
            {loadClientDropdown()}
        </Layout>
    )
}