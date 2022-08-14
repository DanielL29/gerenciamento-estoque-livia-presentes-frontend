import './ProductCard.css'

let month = new Date().getMonth() + 1
let year = new Date().getFullYear()

if (month < 10) month = `0${month}`

let date = `${month}/${year}`

export default function ProductCard(props) {
    return (
        <div className="product-container">
            <div className={`product-card ${!props.isHistory ? '' : 'no-description'}`}>
                <div>
                    <img src={`${props.imageUrl.startsWith('https://') ? props.imageUrl : 'images/default-image.jpg'}`} alt="default-product-img" />
                </div>
                <div className="product">
                    <h1><span>Nome:</span><span className="invisible">i</span>{props.name}</h1>
                    <div className="product-row">
                        <span>Produto</span>
                        <h2>{props.product}</h2>
                        <h2>{props.productType}</h2>
                    </div>
                    <h1><span>Preço:</span><span className="invisible">i</span>{props.price}</h1>
                    {props.isHistory ? <h1><span>Data da compra:</span><span className="invisible">i</span>{props.priceDate}</h1> : ''}
                    <div>
                        <h3><span>Relação(Marca/Linha):</span><span className="invisible">i</span>{props.relation}</h3>
                    </div>
                </div>
                {!props.isHistory ? (
                    <div className="description">
                        <p><span>Descrição:</span><span className="invisible">i</span>{props.description}</p>
                    </div>
                ) : (
                    <div className={`payment ${props.payed === true ? 'payed' : ''}`}>
                        <p>Este produto já foi pago? </p>
                        <div>
                            <button onClick={() => props.onClick()}>
                                <ion-icon name="checkmark-outline"></ion-icon>
                            </button>
                            <button>
                                <ion-icon name="close-outline"></ion-icon>
                            </button>
                        </div>
                    </div>
                )}
                <div className="quantities">
                    <div className={`quantity ${props.quantity === 0 ? 'red' : ''}`}>
                        <span>{!props.isHistory ? 'Quantidade em estoque' : 'Quantidade comprada'}</span>
                        <h4>{props.quantity}</h4>
                        {props.quantity === 0 ? <p>Produto em falta no estoque...</p> : ''}
                    </div>
                    <div>
                        <span>Conteúdo</span>
                        <h4>{props.content}</h4>
                    </div>
                    {!props.isHistory ? (
                        <div>
                            <span className={date === props.validity ? 'color-red' : ''}>Validade</span>
                            <h4 className={date === props.validity ? 'color-red' : ''}>{props.validity}</h4>
                            {date === props.validity ? <p className={`validity-warning ${date === props.validity ? 'color-red' : ''}`}>Este produto está perto de vencer! *Cuidado*</p> : ''}
                        </div>
                    ) : ''}
                </div>
            </div>
            {props.isHistory ? props.isRefil ? (
                <div className="refil">
                    <p>Avise pra repor o refil após: {props.refilWarning} dias</p>
                </div>
            ) : '' : ''}
            {!props.isHistory ? '' : (
                <button className={`delete-prod-history ${props.isRefil ? 'margin' : ''}`} onClick={() => props.delete()}>
                    <ion-icon name="trash"></ion-icon>
                    <span>Excluir ? </span>
                </button>
            )}
        </div>
    )
}