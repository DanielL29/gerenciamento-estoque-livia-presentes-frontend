import { Link } from 'react-router-dom'
import './SidebarRoutes.css'

export default function SidebarRoutes(props) {
    return (
        <Link to={props.path} className="link">
            <div className="side-card">
                <ion-icon className="icon" name={props.icon}></ion-icon>
                <h1>{props.routeName}</h1>
            </div>
        </Link>
    )
}