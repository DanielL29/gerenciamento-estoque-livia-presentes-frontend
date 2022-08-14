import Layout from "../../template/layout/Layout";
import ProductCard from "../../template/product-card/ProductCard";
import axios from 'axios';
import { useEffect, useState } from "react";
import './Product.css';
import { BASE_URL } from './../../../index';

let month = new Date().getMonth() + 1
let year = new Date().getFullYear()

if (month < 10) month = `0${month}`

let date = `${month}/${year}`

export default function Product() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [searchByName, setSearchByName] = useState('')
    const [searchByCategory, setSearchByCategory] = useState('')
    const [natura, setNatura] = useState([])
    const [avon, setAvon] = useState([])
    const [naturaId, setNaturaId] = useState('')
    const [lacking, setLacking] = useState(false)
    const [due, setDue] = useState(false)

    useEffect(() => {
        getProducts()
        getCategories()
        getProductsNatura()
        getProductsAvon()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products])

    async function getProducts() {
        const productsData = await axios.get(`${BASE_URL}/products`)
        setProducts(productsData.data)
    }

    async function getCategories() {
        const categoriesData = await axios.get(`${BASE_URL}/categories`)
        setCategories(categoriesData.data)
    }

    async function getProductsNatura() {
        const naturaId = categories.filter(category => category.name.toLowerCase() === 'natura').map(category => category._id)
        const naturaData = await axios.get(`${BASE_URL}/products?father=${naturaId[0]}`)
        setNatura(naturaData.data)
        setNaturaId(naturaId[0])
    }

    async function getProductsAvon() {
        const avonId = categories.filter(category => category.name.toLowerCase() === 'avon').map(category => category._id)
        const avonData = await axios.get(`${BASE_URL}/products?father=${avonId[0]}`)
        setAvon(avonData.data)
    }

    function loadCategories() {
        return categories.map(category => {
            return (
                <option key={category.id} value={JSON.stringify({ id: category._id, parentId: category.parentId })}>{category.path}</option>
            )
        })
    }

    function loadProductsCards() {
        const filterByName = products.filter(product => searchByCategory ? product.categoryId === JSON.parse(searchByCategory).id : product.name.toLowerCase().includes(searchByName.toLowerCase()))
        const filterByLacking = products.filter(product => product.quantity === 0)
        const filterByDueDate = products.filter(product => product.validity.split("T")[0].split("-").reverse().splice(1, 2).join("/") === date)
        const filter = () => {
            if (lacking) return filterByLacking
            if (due) return filterByDueDate
            return filterByName
        }

        if (searchByCategory !== "" && JSON.parse(searchByCategory).parentId === null) {
            const mark = JSON.parse(searchByCategory).id === naturaId ? natura : avon 

            return mark.sort((a, b) => a.categoryId - b.categoryId)
                .map(product => {
                    return (
                        <ProductCard key={product._id}
                            name={product.name}
                            imageUrl={product.imageUrl}
                            product={product.product}
                            productType={product.productType}
                            relation={categories.map(category => category._id === product.categoryId ? category.path : '')}
                            description={product.description}
                            quantity={product.quantity}
                            content={product.content}
                            price={product.price}
                            validity={product.validity.split("T")[0].split("-").reverse().splice(1, 2).join("/") || product.validity}
                        />
                    )
                }
                )
        }
        else if (due && filterByDueDate.length === 0) return <h1>Nenhum produto perto do vencimento</h1>
        else if (lacking && filterByLacking.length === 0) return <h1>Nenhum produto em falta</h1>
        else if (filterByName.length === 0 && filterByLacking.length === 0) return <h1>Produto não encontrado</h1>
        else {
            return filter().sort((a, b) => a.categoryId - b.categoryId)
                .map(product => {
                    return (
                        <ProductCard key={product._id}
                            name={product.name}
                            imageUrl={product.imageUrl}
                            product={product.product}
                            productType={product.productType}
                            relation={categories.map(category => category._id === product.categoryId ? category.path : '')}
                            description={product.description}
                            quantity={product.quantity}
                            content={product.content}
                            price={product.price}
                            validity={product.validity.split("T")[0].split("-").reverse().splice(1, 2).join("/") || product.validity}
                        />
                    )
                }
                )
        }
    }

    return (
        <Layout title="Produtos" subtitle="Pagina dos produtos" icon="bag-handle">
            <div className="search-container">
                <div className="search-products">
                    <label>Filtrar por nome</label>
                    <input type="text" placeholder="Pesquise o produto pelo nome..." value={searchByName} onChange={(e) => setSearchByName(e.target.value)} />
                </div>
                <div className="search-products">
                    <label>Filtrar por Categoria(Marca/Linha)</label>
                    <select value={searchByCategory} onChange={(e) => setSearchByCategory(e.target.value)}>
                        <option value="" disabled>Pesquise pela Categoria(Marca/Linha)...</option>
                        <option value="">Todos</option>
                        {loadCategories()}
                    </select>
                </div>
                <div className="search-products">
                    <button onClick={() => setLacking(!lacking)}>Filtrar/Desfiltrar Produtos em Falta {lacking ? '*Filtro Ativo*' : ''}</button>
                </div>
                <div className="search-products">
                    <button onClick={() => setDue(!due)}>Filtrar/Desfiltrar Produtos a Vencerem {due ? '*Filtro Ativo*' : ''}</button>
                </div>
            </div>
            {loadProductsCards()}
        </Layout>
    )
}