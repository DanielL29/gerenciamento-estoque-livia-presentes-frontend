import './ClientDropdown.css'

let day = new Date().getDate()
let month = new Date().getMonth() + 1

if (month < 10) month = `0${month}`
if (day < 10) day = `0${day}`

let date = `${day}/${month}`

export default function ClientDropdown(props) {
    return (
        <div className="client-dropdown">
            <div className="client-name" onClick={(e) => props.onClick(e)}>
                <div className="icon">
                    <ion-icon name="chevron-forward-outline"></ion-icon>
                </div>
                {props.clientName}
                <div className="other-infos">
                    <p>- <strong>CPF:</strong> {props.cpf}</p>
                    <p>- <strong>Endereço:</strong> {props.address}</p>
                    <p>- <strong>CEP:</strong> {props.cep}</p>
                    <p>- <strong>Aniversário:</strong> {props.birthday}</p>
                </div>
                {date === props.birthday ? <p className="birthday-warning">- Hoje é aniversário deste cliente!</p> : ''}
            </div>
            <div className="client-content">
                {props.children}
            </div>
        </div>
    )
}