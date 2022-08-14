import './HomeCard.css'

export default function HomeCard(props) {
    return (
        <div className="home-card">
            <div>
                <ion-icon name={props.icon}></ion-icon>
                <h1>{props.cardTitle}</h1>
            </div>
            <h2>{props.quantity}</h2>
            {/* <span>Qtd: </span> */}
        </div>
    )
}