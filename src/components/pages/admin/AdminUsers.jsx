import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './../../../index';

const toggleUsers = () => document.querySelector('.management-user').classList.toggle('active')

export default function AdminUsers() {
    const [userObject, setUserObject] = useState({})
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [admin, setAdmin] = useState(false)
    const [users, setUsers] = useState([])
    const [mode, setMode] = useState('')
    const validateFields = name === "" || email === "" || password === "" || confirmPassword === "" ? true : false
    const [validate, setValidate] = useState(false)

    useEffect(() => {
        getUsers()
        setObjectValues()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users])

    async function getUsers() {
        const usersData = await axios.get(`${BASE_URL}/users`)
        setUsers(usersData.data)
    }

    async function loadUser(user, mode = '') {
        await axios.get(`${BASE_URL}/users/${user._id}`).then(res => {
            console.log(res.data)
            setUserObject(res.data)
            setName(res.data.name)
            setEmail(res.data.email)
            setAdmin(res.data.admin)
        })
        setMode(mode)
    }

    function setObjectValues() {
        if(userObject._id) {
            setUserObject({
                _id: userObject._id,
                name,
                email,
                password,
                confirmPassword,
                admin
            })
        } else {
            setUserObject({
                name,
                email, 
                password,
                confirmPassword,
                admin
            })
        }
    }

    function resetUser() {
        setUserObject({})
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setAdmin(false)
        setMode('')
        setValidate(false)
    }

    function saveUser() {
        setValidate(true)
        console.log(userObject)
        if(!validateFields) {
            const method = userObject._id ? 'put' : 'post'
            const promise = axios[method](`${BASE_URL}/users/${method === 'put' ? userObject._id : ''}`, userObject)
            promise.then(resetUser)
            promise.catch(res => console.log(res.response))
        }
    }

    function deleteUser() {
        axios.delete(`${BASE_URL}/users/${userObject._id}`)
        resetUser()
        setMode('')
    }

    function loadUsers() {
        return users.sort((a, b) => a.id - b.id).map((user, i) => {
            return (
                <tr key={user._id}>
                    <td>{i + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.admin.toString()}</td>
                    <td>
                        <button className="edit-button" onClick={() => loadUser(user)}>
                            <ion-icon name="create-outline"></ion-icon>
                        </button>
                    </td>
                    <td>
                        <button className="edit-button" onClick={() => loadUser(user, 'delete')}>
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className="user-form">
            <div className="title-row">
                <ion-icon name="add-circle"></ion-icon>
                <h1>Cadastrar novo Usuário</h1>
            </div>
            <div className="first-row">
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Nome</label>
                    <input type="text" placeholder="Nome do usuário" required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={mode === 'delete'}
                    />
                    {name === "" && validate ? <p className="red">Preencha o campo do nome</p> : ''}
                </div>
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Email</label>
                    <input type="email" placeholder="Email do usuário" required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={mode === 'delete'}
                    />
                    {email === "" && validate ? <p className="red">Preencha o campo do email</p> : ''}
                </div>
            </div>
            {mode === 'delete' ? '' : (
                <div className="first-row">
                    <div className="field-row">
                        <label>Senha</label>
                        <input type="password" placeholder={userObject.id ? "Informe uma nova senha" : "Senha do usuário"} required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {password === "" && validate ? <p className="red">Preencha o campo da senha</p> : ''}
                    </div>
                    <div className="field-row">
                        <label>Confirmação de Senha</label>
                        <input type="password" placeholder={userObject.id ? "Informe uma nova confirmação de senha" : "Confirmação de senha do usuário"} required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPassword === "" && validate ? <p className="red">Preencha o campo da Confirmação de senha</p> : ''}
                    </div>
                </div>
            )}
            {mode === 'delete' ? '' : (
                <div className="first-row">
                    <div className="field-row">
                        <label>Definir Usuário como Administrador ?</label>
                        <div className="select">
                            <div className="select-row">
                                <input type="radio" name="admin" id="true" value={admin} 
                                    onClick={() => setAdmin(true)} disabled={mode === 'delete'} />
                                <label htmlFor="true">Sim</label>
                            </div>
                            <div className="select-row">
                                <input type="radio" name="admin" id="false" value={admin} 
                                    onClick={() => setAdmin(false)} disabled={mode === 'delete'} />
                                <label htmlFor="false">Não</label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="buttons"> 
                {mode === 'delete' ? (
                    <div className="field-row">
                        <button className="red" onClick={deleteUser}>Deletar ?</button>
                    </div>
                ) : (
                    <div className="field-row">
                        <button onClick={saveUser}>{userObject._id ? 'Atualizar' : 'Cadastrar'}</button>
                    </div>
                )}
                {userObject._id ? (
                    <div className="field-row cancel">
                        <button onClick={resetUser}>Cancelar</button>
                    </div>
                ) : ''}
            </div>

            <hr />

            <div className="management-user">
                <div className="management-title" onClick={toggleUsers}>
                    <div className="icon">
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </div>
                    <h1><strong>Gerenciar Usuários</strong></h1>
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Administrador ?</th>
                                <th>Editar</th>
                                <th>Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadUsers()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}