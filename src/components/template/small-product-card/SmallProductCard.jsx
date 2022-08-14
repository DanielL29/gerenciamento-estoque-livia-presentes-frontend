import { useState } from 'react'
import './SmallProductCard.css'

export default function SmallProductCard(props) {
    const [counter, setCounter] = useState(1)

    function decrementQtd() {
        if(counter > 1) setCounter(counter - 1)
    }

    function incrementQtd() {
        if(counter < props.quantity) setCounter(counter + 1)
    }

    return (
        <div className="product">
            <div>
                <h1><span>Nome:</span>{props.productName}</h1>
                <div>
                    <span>Produto</span>
                    <h2>{props.product}</h2>
                    <h2>{props.productType}</h2>
                </div>
                <h3><span>Relação:</span>{props.relation}</h3>
                <h3><span>Qtd em estoque:</span>{props.quantity}</h3>
            </div>
            <div className="send-history">
                <div className="quantity">
                    <div>
                        <h4>Qtd: </h4>
                        <p>{counter}</p>
                    </div>
                    <div>
                        <button onClick={decrementQtd}>-</button>
                        <button onClick={incrementQtd}>+</button>
                    </div>
                </div>
                <button onClick={() => props.onClick(counter)}>Adicionar ao Histórico</button>
            </div>
        </div>
    )
}