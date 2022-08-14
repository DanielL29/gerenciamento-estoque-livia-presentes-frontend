import { useEffect, useState } from 'react'
import axios from 'axios'
import './Auth.css'
import { BASE_URL } from './../../../index';

export default function Auth() {
    const [userObject, setUserObject] = useState({})
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSignIn, setIsSignIn] = useState(false)
    const matchPassword = password === confirmPassword

    useEffect(() => {
        setObjectValues()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, email, password, confirmPassword])

    function setObjectValues() {
        setUserObject({
            name,
            email,
            password,
            confirmPassword,
            admin: false
        })
    }

    function resetUser() {
        setUserObject({})
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }

    function signIn(e) {
        e.preventDefault()
        const promise = axios.post(`${BASE_URL}/sign-in`, { email, password })
        promise.then(res => {
            localStorage.setItem('userKey', res.data.token)
            localStorage.setItem('currentUser', JSON.stringify(res.data))
            resetUser()
            window.location.reload()
        })
        promise.catch(res => console.log(res.response))
    }

    function signUp(e) {
        e.preventDefault()
        const promise = axios.post(`${BASE_URL}/sign-up`, userObject)
        promise.then(res => {
            resetUser()
            setIsSignIn(true)
        })
        promise.catch(res => console.log(res.response))
    }

    return (
        <form onSubmit={!isSignIn ? signUp : signIn}>
            <div className="auth">
                <div>
                    <img src="./images/livia-presentes-logo.png" alt="logo" />
                    <div className="field">
                        <h1>{!isSignIn ? 'Cadastro' : 'Login'}</h1>
                    </div>
                    {!isSignIn ? (
                        <div className="field">
                            <label>Nome</label>
                            <input type="text" placeholder="Nome do usuário" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                    ) : ''}
                    <div className="field">
                        <label>Email</label>
                        <input type="email" placeholder="Email do usuário" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="field">
                        <label>Senha</label>
                        <input type="password" placeholder="Senha do usuário" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="field">
                        <label>Confirmação de senha</label>
                        <input type="password" placeholder="Confirmação de senha do usuário" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        {!matchPassword ? <p className="red">Senhas não conferem</p> : ''}
                    </div>
                    <div className="field">
                        {!isSignIn ? <button>Cadastro</button> : <button>Login</button>}
                    </div>
                    <div className="switch" onClick={() => setIsSignIn(!isSignIn)}>
                        {!isSignIn ? 'Já tem cadastro ? Clique aqui para ir pro login' : 'Não está cadastrado ainda ? Clique aqui para se cadastrar'}
                    </div>
                </div>
            </div>
        </form>
    )
}