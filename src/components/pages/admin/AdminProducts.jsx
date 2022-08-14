import axios from 'axios'
import { useEffect, useState } from 'react'
import { BASE_URL } from './../../../index';

const toggleProducts = () => document.querySelector('.management-product').classList.toggle('active')

export default function AdminProducts() {
    const [productObject, setProductObject] = useState({})
    const [name, setName] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [product, setProduct] = useState('')
    const [productType, setProductType] = useState('')
    const [content, setContent] = useState('')
    const [quantity, setQuantity] = useState('')
    const [description, setDescription] = useState('')
    const [validity, setValidity] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [isRefil, setIsRefil] = useState(false)
    const [price, setPrice] = useState('')
    const [refilWarning, setRefilWarning] = useState('0')
    const [categories, setCategories] = useState([])
    const [mode, setMode] = useState('')
    const [products, setProducts] = useState([])
    const [count, setCount] = useState(0)
    const [countPages, setCountPages] = useState(1)
    const [limit, setLimit] = useState(5)
    const [toShow, setToShow] = useState(0)
    let qtdPage = Math.ceil(count / 5)
    const validateFields = name === "" || product === "" || productType === "" || content === "" || quantity === "" || categoryId === "" || validity === "" ? true : false
    const [validate, setValidate] = useState(false)

    useEffect(() => {
        getCategories()
        getProducts()
        setObjectValues()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products])

    async function getCategories() {
        const categoryData = await axios.get(`${BASE_URL}/categories`)
        setCategories(categoryData.data)
    }

    async function getProducts() {
        const productsData = await axios.get(`${BASE_URL}/products`)
        setProducts(productsData.data)
        setCount(productsData.data.length)
    }

    function setObjectValues() {
        if (productObject._id) {
            setProductObject({
                _id: productObject._id,
                name,
                imageUrl,
                product,
                productType,
                content,
                quantity,
                description,
                validity,
                price,
                isRefil,
                refilWarning,
                categoryId
            })
        } else {
            setProductObject({
                name,
                imageUrl,
                product,
                productType,
                content,
                quantity,
                description,
                validity,
                price,
                isRefil,
                refilWarning,
                categoryId
            })
        }
    }

    function resetProduct() {
        setProductObject({})
        setName('')
        setImageUrl('')
        setProduct('')
        setProductType('')
        setContent('')
        setQuantity('')
        setDescription('')
        setValidity('')
        setPrice('')
        setIsRefil(false)
        setRefilWarning('0')
        setCategoryId('')
        setMode('')
        setValidate(false)
    }

    function loadProduct(product, mode = '') {
        axios.get(`${BASE_URL}/products/${product._id}`).then(res => {
            setProductObject(res.data)
            setName(res.data.name)
            setImageUrl(res.data.imageUrl)
            setProduct(res.data.product)
            setProductType(res.data.productType)
            setContent(res.data.content)
            setQuantity(res.data.quantity)
            setDescription(res.data.description)
            setValidity(res.data.validity)
            setPrice(res.data.price)
            setIsRefil(res.data.isRefil)
            setRefilWarning(res.data.refilWarning)
            setCategoryId(res.data.categoryId)
        })
        setMode(mode)
    }

    function saveProduct() {
        setValidate(true)
        let product = productObject
        if(product.imageUrl === "" && product.description === "") {
            product.imageUrl = " "
            product.description = " "
        } else if(product.imageUrl === "") {
            product.imageUrl = " "
        } else if(product.description === "") {
            product.description = " "
        } else {
            product.imageUrl = product.imageUrl.trim()
        }
        if (!validateFields) {
            const method = productObject._id ? 'put' : 'post'
            const promise = axios[method](`${BASE_URL}/products/${method === 'put' ? product._id : ''}`, product)
            promise.then(resetProduct)
            promise.catch(res => console.log(res.response))
        }
    }

    function deleteProduct() {
        axios.delete(`${BASE_URL}/products/${productObject._id}`).catch(res => console.log(res.response))
        resetProduct()
        setMode('')
    }

    function loadCategories() {
        return categories.sort((a, b) => a.path - b.path).map(category => {
            return (
                <option key={category._id} value={category._id}>{category.path}</option>
            )
        })
    }

    function loadProducts() {
        return products
            .sort((a, b) => a.id - b.id)
            .filter((_, i) => i >= toShow && i < limit)
            .map((product, i) => {
                return (
                    <tr key={product._id}>
                        <td>{i + 1}</td>
                        <td>{product.name}</td>
                        <td>{product.product}</td>
                        <td>{product.productType}</td>
                        <td>{product.content}</td>
                        <td>{product.quantity}</td>
                        <td>{product.validity.split("-").reverse().join("/") || product.validity}</td>
                        <td>{product.price}</td>
                        <td>{categories.map(category => category._id === product.categoryId ? category.path : '')}</td>
                        <td>
                            <button className="edit-button" onClick={() => loadProduct(product)}>
                                <ion-icon name="create-outline"></ion-icon>
                            </button>
                        </td>
                        <td>
                            <button className="edit-button" onClick={() => loadProduct(product, 'delete')}>
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
        <div className="product-form">
            <div className="title-row">
                <ion-icon name="add-circle"></ion-icon>
                <h1>Cadastrar novo Produto</h1>
            </div>
            <div className="first-row">
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Nome</label>
                    <input type="text" placeholder="Nome do produto"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={mode === 'delete'}
                    />
                    {name === "" && validate ? <p className="red">Preencha o campo do nome</p> : ''}
                </div>
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Imagem</label>
                    <input type="text" placeholder="Imagem do produto com URL (Opicional)"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        disabled={mode === 'delete'}
                    />
                </div>
            </div>
            <div className="second-row">
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Produto</label>
                    <input type="text" placeholder="Informe o produto" required
                        value={product}
                        onChange={e => setProduct(e.target.value)}
                        disabled={mode === 'delete'}
                    />
                    {product === "" && validate ? <p className="red">Preencha o campo do produto</p> : ''}
                </div>
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Tipo do Produto</label>
                    <input type="text" placeholder="Informe o tipo do produto" required
                        value={productType}
                        onChange={e => setProductType(e.target.value)}
                        disabled={mode === 'delete'}
                    />
                    {productType === "" && validate ? <p className="red">Preencha o campo do tipo do produto</p> : ''}
                </div>
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''} long`}>
                    <label>Conteúdo (ml, g)</label>
                    <input type="text" placeholder="Conteúdo Ex:(200ml ou 20g)" required
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        disabled={mode === 'delete'}
                    />
                    {content === "" && validate ? <p className="red">Preencha o campo do conteúdo do produto</p> : ''}
                </div>
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''} long`}>
                    <label>Quantidade em Estoque</label>
                    <input type="number" placeholder="Quantidade deste produto(pelo menos 1)" required
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        disabled={mode === 'delete'}
                    />
                    {quantity === "" && validate ? <p className="red">Informe a quantidade desse produto em estoque</p> : ''}
                </div>
            </div>
            <div className="first-row">
                <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                    <label>Descrição</label>
                    <textarea placeholder="Descrição do produto (Opcional)" cols="30" rows="10"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        disabled={mode === 'delete'}
                    />
                </div>
                <div className="field-row">
                    <label>Categoria / Marca do Produto</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={mode === 'delete'}>
                        <option value="" disabled>Selecione a Categoria / Linha do produto</option>
                        {loadCategories()}
                    </select>
                    {categoryId === "" && validate ? <p className="red">Informe a qual marca/linha/categoria este produto pertence</p> : ''}

                    <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                        <label>Validade</label>
                        <input type="date" id="validity" required
                            value={validity}
                            onChange={e => setValidity(e.target.value)}
                            disabled={mode === 'delete'}
                        />
                        {validity === "" && validate ? <p className="red">Preencha a validade do produto</p> : ''}
                    </div>
                    <div className="field-row">
                        <label>Preço</label>
                        <input type="number" placeholder="Preço do produto" required
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            disabled={mode === 'delete'}
                        />
                        {price === "" && validate ? <p className="red">Preencha o preço do produto</p> : ''}
                    </div>
                </div>
                {mode === 'delete' ? '' : (
                    <div className="first-row">
                        <div className="field-row">
                            <label>O produto é refil ?</label>
                            <div className="select">
                                <div className="select-row">
                                    <input type="radio" name="admin" id="true" value={isRefil} onClick={() => setIsRefil(true)}
                                        disabled={mode === 'delete'} />
                                    <label htmlFor="true">Sim</label>
                                </div>
                                <div className="select-row">
                                    <input type="radio" name="admin" id="false" value={isRefil} onClick={() => setIsRefil(false)}
                                        disabled={mode === 'delete'} />
                                    <label htmlFor="false">Não</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {isRefil ? (
                    <div className="first-row">
                        <div className={`field-row ${mode === 'delete' ? 'disabled' : ''}`}>
                            <label>Data de repor refil</label>
                            <input type="number" placeholder="Dias até a reposição do refil ex: 30 = 30 dias/1 mes"
                                value={refilWarning}
                                onChange={e => setRefilWarning(e.target.value)}
                                disabled={mode === 'delete'}
                            />
                        </div>
                    </div>
                ) : ''}
            </div>
            <div className="buttons">
                {mode === 'delete' ? (
                    <div className="field-row">
                        <button className="red" onClick={deleteProduct}>Deletar ?</button>
                    </div>
                ) : (
                    <div className="field-row">
                        <button onClick={saveProduct}>{productObject._id ? 'Atualizar' : 'Cadastrar'}</button>
                    </div>
                )}
                {productObject._id ? (
                    <div className="field-row cancel">
                        <button onClick={resetProduct}>Cancelar</button>
                    </div>
                ) : ''}
            </div>

            <hr />

            <div className="management-product">
                <div className="management-title" onClick={toggleProducts}>
                    <div className="icon">
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </div>
                    <h1><strong>Gerenciar Produtos</strong></h1>
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Produto</th>
                                <th>Tipo do Produto</th>
                                <th>Conteúdo</th>
                                <th>Quantidade</th>
                                <th>Validade</th>
                                <th>Preço</th>
                                <th>Relações</th>
                                <th>Editar</th>
                                <th>Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadProducts()}
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