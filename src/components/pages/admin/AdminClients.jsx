import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from './../../../index';

function hideYear() {
    let year = new Date().getFullYear();
    document.querySelector('#date').setAttribute("min", year + "-01-01");
    document.querySelector('#date').setAttribute("max", year + "-12-31");
}

const toggleClients = () => document.querySelector('.management-client').classList.toggle('active')

export default function AdminClients() {
    const [clientObject, setClientObject] = useState({})
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [birthday, setBirthday] = useState('')
    const [cpf, setCPF] = useState('')
    const [cep, setCEP] = useState('')
    const [clients, setClients] = useState([])
    const [toShow, setToShow] = useState(0)
    const [limit, setLimit] = useState(5)
    const [mode, setMode] = useState('')
    const [count, setCount] = useState(0)
    const [countPages, setCountPages] = useState(1)
    let qtdPage = Math.ceil(count / 5)
    const validateFields = name === "" || address === "" || birthday === "" || cpf === "" || cep === "" ? true : false
    const [validate, setValidate] = useState(false)

    useEffect(() => {
        getClients()
        setObjectValues()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clients])

    async function getClients() {
        const clientData = await axios.get(`${BASE_URL}/clients`)
        setClients(clientData.data)
        setCount(clientData.data.length)
    }

    function setObjectValues() {
        if (clientObject._id) {
            setClientObject({
                _id: clientObject._id,
                name,
                cpf,
                address,
                cep,
                birthday
            })
        } else {
            setClientObject({
                name,
                cpf,
                address,
                cep,
                birthday
            })
        }
    }

    function resetClient() {
        setClientObject({})
        setName('')
        setCPF('')
        setCEP('')
        setAddress('')
        setBirthday('')
        setMode('')
        setValidate(false)
    }

    function limitCPF(e) {
        if (e.target.value !== null) {
            if (e.target.value.length > 11) return
        }
        setCPF(e.target.value)
    }

    function limitCEP(e) {
        if (e.target.value !== null) {
            if (e.target.value.length > 8) return
        }
        setCEP(e.target.value)
    }

    function saveClient() {
        setValidate(true)
        if(!validateFields) {
            const method = clientObject._id ? 'put' : 'post'
            const promise = axios[method](`${BASE_URL}/clients/${method === 'put' ? clientObject._id : ''}`, clientObject)
            promise.then(resetClient)
            promise.catch((res) => console.log(res.response))
        }
    }

    function deleteClient() {
        axios.delete(`${BASE_URL}/clients/${clientObject._id}`)
        resetClient()
        setMode('')
    }

    async function loadClient(client, mode = '') {
        await axios.get(`${BASE_URL}/clients/${client._id}`).then(res => {
            setClientObject(res.data)
            setName(res.data.name)
            setCPF(res.data.cpf)
            setAddress(res.data.address)
            setCEP(res.data.cep)
            setBirthday(res.data.birthday.split("T")[0])
        })
        setMode(mode)
    }

    function loadClients() {
        return clients
            .sort((a, b) => a.id - b.id)
            .filter((_, i) => i >= toShow && i < limit)
            .map((client, i) => {
                return (
                    <tr key={client._id}>
                        <td>{i + 1}</td>
                        <td>{client.name}</td>
                        <td>{client.cpf}</td>
                        <td>{client.address}</td>
                        <td>{client.cep}</td>
                        <td>{client.birthday.split("T")[0].split("-").reverse().splice(0, 2).join("/")}</td>
                        <td>
                            <button className="edit-button" onClick={() => loadClient(client)}>
                                <ion-icon name="create-outline"></ion-icon>
                            </button>
                        </td>
                        <td>
                            <button className="edit-button" onClick={() => loadClient(client, 'delete')}>
                                <ion-icon name="trash-outline"></ion-icon>
                            </button>
                        </td>
                    </tr>
                )
            }
        )
    }

    function quantityTables() {
        let pages = []
        for (let i = 0; i < qtdPage; i++) pages.push('')
        return pages.map((_, i) => {
            return (
                <div key={i} className={`page-item ${countPages === (i + 1) ? 'page-selected' : ''}`}>{i + 1}</div>
            )
        })
    }

    function decrementPage() {
        if (countPages - 1 !== 0) {
            setCountPages(countPages - 1)
            setLimit(limit - 5)
            setToShow(toShow - 5)
        }
    }

    function incrementPage() {
        if (countPages + 1 <= qtdPage) {
            setCountPages(countPages + 1)
            setLimit(limit + 5)
            setToShow(toShow + 5)
        }
    }

    setTimeout(hideYear, 2000)
    
    return (
        <div className="client-form">
            <div className="title-row">
                <ion-icon name="add-circle"></ion-icon>
                <h1>Cadastrar novo Cliente</h1>
            </div>
            <div className="first-row">
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Nome</label>
                    <input type="text" placeholder="Nome do cliente" value={name} onChange={(e) => setName(e.target.value)} />
                    {name === "" && validate ? <p className="red">Preencha o campo do nome</p> : ''}
                </div>
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>CPF</label>
                    <input type="number" value={cpf} onChange={(e) => limitCPF(e)} placeholder="CPF do cliente" />
                    {cpf === "" && validate ? <p className="red">Preencha o campo do CPF</p> : ''}
                </div>
            </div>
            <div className="first-row">
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Endereço</label>
                    <input type="text" placeholder="Endereço do cliente" value={address} onChange={(e) => setAddress(e.target.value)} />
                    {address === "" && validate ? <p className="red">Preencha o campo do endereço</p> : ''}
                </div>
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>CEP</label>
                    <input type="number" value={cep} onChange={(e) => limitCEP(e)} placeholder="CEP do cliente" />
                    {cep === "" && validate ? <p className="red">Preencha o campo do CEP</p> : ''}
                </div>
            </div>
            <div className="first-row">
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Aniversário do Cliente</label>
                    <input type="date" id="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                    {birthday === "" && validate ? <p className="red">Preencha o campo do aniversário do cliente</p> : ''}
                </div>
            </div>
            <div className="buttons"> 
                {mode === 'delete' ? (
                    <div className="field-row">
                        <button className="red" onClick={deleteClient}>Deletar ?</button>
                    </div>
                ) : (
                    <div className="field-row">
                        <button onClick={saveClient}>{clientObject._id ? 'Atualizar' : 'Cadastrar'}</button>
                    </div>
                )}
                {clientObject._id ? (
                    <div className="field-row cancel">
                        <button onClick={resetClient}>Cancelar</button>
                    </div>
                ) : ''}
            </div>

            <hr />

            <div className="management-client">
                <div className="management-title" onClick={toggleClients}>
                    <div className="icon">
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </div>
                    <h1><strong>Gerenciar Clientes</strong></h1>
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Endereço</th>
                                <th>CEP</th>
                                <th>Aniversário</th>
                                <th>Editar</th>
                                <th>Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadClients()}
                        </tbody>
                    </table>
                </div>
                <div className="pagination">
                    <div className="page-item" onClick={decrementPage}>
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </div>
                    {quantityTables()}
                    <div className="page-item" onClick={incrementPage}>
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </div>
                </div>
            </div>
        </div>
    )
}