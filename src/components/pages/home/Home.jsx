import HomeCard from "../../template/home-card/HomeCard";
import Layout from "../../template/layout/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from './../../../index';

export default function Home() {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    const [users, setUsers] = useState(0)
    const [products, setProducts] = useState(0)
    const [clients, setClients] = useState(0)
    const [histories, setHistories] = useState(0)
    const [historiesData, setHistoriesData] = useState([])
    const [monthBilling, setMonthBilling] = useState('00,00')

    useEffect(() => {
        getUsers()
        getProducts()
        getClients()
        getHistories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users, products, clients, histories, historiesData])

    async function getUsers() {
        const usersData = await axios.get(`${BASE_URL}/users`)
        setUsers(usersData.data.length)
    }

    async function getProducts() {
        const productsData = await axios.get(`${BASE_URL}/products`)
        setProducts(productsData.data.length)
    }

    async function getClients() {
        const clientsData = await axios.get(`${BASE_URL}/clients`)
        setClients(clientsData.data.length)
    }

    async function getHistories() {
        const historiesData = await axios.get(`${BASE_URL}/histories`)
        setHistories(historiesData.data.length)
        setHistoriesData(historiesData.data)
        getMonthBilling()
    }

    function getMonthBilling() {
        let month = new Date().getMonth() + 1
        let year = new Date().getFullYear()

        if (month < 10) month = `0${month}`

        let date = `${month}/${year}`

        if(historiesData.length > 0) {
            const billing = historiesData.filter(history => history.priceDate === date)
                .map(history => Number(history.price) * Number(history.quantity))
                .reduce((a, b) => a + b)
            setMonthBilling(billing.toFixed(2).replace('.', ','))

        }
    }

    return (
        <Layout title="Início" subtitle="Pagina principal da aplicação, painel de controle com informações e detalhes." icon="home">
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {user.user.admin ? <HomeCard cardTitle="Usuários" quantity={users} icon="people-circle" /> : ''}
                <HomeCard cardTitle="Produtos" quantity={products} icon="bag-handle" />
                <HomeCard cardTitle="Clientes" quantity={clients} icon="people" />
                {user.user.admin ? <HomeCard cardTitle="Vendas" quantity={histories} icon="receipt" /> : '' }
                {user.user.admin ? <HomeCard cardTitle="Faturamento mensal" quantity={`R$ ${monthBilling}`} icon="cash" /> : '' }
            </div>
        </Layout>
    )
}