import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './../../../index';

const toggleCategories = () => document.querySelector('.management').classList.toggle('active')

export default function AdminCategories() {
    const [categoryObject, setCategoryObject] = useState({})
    const [name, setName] = useState('')
    const [parentId, setParentId] = useState('')
    const [categories, setCategories] = useState([])
    const [mode, setMode] = useState('')
    const [count, setCount] = useState(0)
    const [countPages, setCountPages] = useState(1)
    const [limit, setLimit] = useState(5)
    const [toShow, setToShow] = useState(0)
    let qtdPage = Math.ceil(count / 5)
    const validateFields = name === "" || parentId === "" ? true : false
    const [validate, setValidate] = useState(false)

    useEffect(() => {
        getCategories()
        setObjectValues()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories])

    async function getCategories() {
        const categoryData = await axios.get(`${BASE_URL}/categories`)
        setCategories(categoryData.data)
        setCount(categoryData.data.length)
    }

    function resetCategory() {
        setCategoryObject({})
        setName('')
        setParentId('')
        setMode('')
        setValidate(false)
    }

    function loadCategory(category, mode = '') {
        axios.get(`${BASE_URL}/categories/${category._id}`).then(res => {
            setCategoryObject(res.data)
            setName(res.data.name)
            setParentId(res.data.parentId)
        }).catch(res => console.log(res.response))
        setMode(mode)
    }

    function setObjectValues() {
        if(categoryObject._id) {
            setCategoryObject({
                _id: categoryObject._id,
                name,
                parentId: parentId === "null" ? null : parentId
            })
        } else {
            setCategoryObject({
                name,
                parentId: parentId === "null" ? null : parentId
            })
        }
    }

    function saveCategory() {
        setValidate(true)
        console.log(categoryObject)
        if(!validateFields) {
            const method = categoryObject._id ? 'put' : 'post'
            const promise = axios[method](`${BASE_URL}/categories/${method === 'put' ? categoryObject._id : ''}`, categoryObject)
            promise.then(resetCategory)
            promise.catch(res => console.log(res.response))
        }
    }

    function deleteCategory() {
        axios.delete(`${BASE_URL}/categories/${categoryObject._id}`).catch(res => console.log(res.response.data))
        resetCategory()
        setMode('')
    }

    function loadCategoriesWithPath() {
        return categories.sort((a, b) => a.path - b.path).map(category => {
            if(!category.parentId) {
                return (
                    <option key={category._id} value={category._id}>{category.path}</option>
                )
            }

            return ''
        })
    }

    function loadCategories() {
        return categories
            .filter((_, i) => i >= toShow && i < limit)
            .map((category, i) => {
                return (
                    <tr key={category._id}>
                        <td>{i + 1}</td>
                        <td>{category.name}</td>
                        <td>{category.path}</td>
                        <td>
                            <button className="edit-button" onClick={() => loadCategory(category)}>
                                <ion-icon name="create-outline"></ion-icon>
                            </button>
                        </td>
                        <td>
                            <button className="edit-button" onClick={() => loadCategory(category, 'delete')}>
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

    return (
        <div className="category-form">
            <div className="title-row">
                <ion-icon name="add-circle"></ion-icon>
                <h1>Cadastrar Categoria / Marca / Linha</h1>
            </div>
            <div className="first-row">
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Nome</label>
                    <input type="text" placeholder="Nome da Categoria / Marca / linha"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={mode === 'delete'}
                    />
                    {name === "" && validate ? <p className="red">Preencha o campo do nome da (Categoria / Marca / linha)</p> : ''}
                </div>
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Categoria / Marcas</label>
                    <select value={parentId} onChange={(e) => setParentId(e.target.value)} disabled={mode === 'delete'}>
                        <option value="" disabled>Selecione a Categoria / Marca</option>
                        <option value="null">Categoria Pai</option>
                        {loadCategoriesWithPath()}
                    </select>
                    {parentId === "" && validate ? <p className="red">Selecione a qual categoria / marca ela vai pertencer</p> : ''}
                </div>
            </div>
            <div className="first-row">
                <div className="field-row">
                    <p className="long">Obs: caso queira cadastrar uma Categoria Pai / Marca nova selecione <strong>"Categoria Pai"</strong></p>
                </div>
            </div>
            <div className="buttons"> 
                {mode === 'delete' ? (
                    <div className="field-row">
                        <button className="red" onClick={deleteCategory}>Deletar ?</button>
                    </div>
                ) : (
                    <div className="field-row">
                        <button onClick={saveCategory}>{categoryObject._id ? 'Atualizar' : 'Cadastrar'}</button>
                    </div>
                )}
                {categoryObject._id ? (
                    <div className="field-row cancel">
                        <button onClick={resetCategory}>Cancelar</button>
                    </div>
                ) : ''}
            </div>

            <hr />

            <div className="management">
                <div className="management-title" onClick={toggleCategories}>
                    <div className="icon">
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </div>
                    <h1><strong>Gerenciar Categorias</strong></h1>
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Relações</th>
                                <th>Editar</th>
                                <th>Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadCategories()}
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