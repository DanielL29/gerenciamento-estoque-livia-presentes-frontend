import Footer from '../footer/Footer'
import './Content.css'

export default function Content(props) {
    return (
        <div className="page-container">
            <div className="content-container">
                <div className="page-titles">
                    <div>
                        <ion-icon name={props.icon}></ion-icon>
                        <h1>{props.title}</h1>
                    </div>
                    <h2>{props.subtitle}</h2>
                </div>
                <div className="content">
                    {props.children}
                </div>
            </div>
            <div className="footer">
                <Footer />
            </div>
        </div>
    )
}