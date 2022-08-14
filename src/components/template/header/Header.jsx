import './Header.css'

export default function Header() {
    const user = JSON.parse(localStorage.getItem('currentUser'))

    return (
        <header>
            <div>
                <div className="logo">
                    <img src="images/gitf.png" alt="gitf.png" />
                </div>
                <div className="title">
                    <img src="images/livia-presentes-logo.png" alt="livia-presentes" />
                </div>
                <div className="user">
                    <div className="perfil-photo">
                        <ion-icon name="person"></ion-icon>
                    </div>
                    <p>{user.user.name}</p>
                    <p>{user.user.admin ? '(ADMIN)' : ''}</p>
                </div>
            </div>
        </header>
    )
}