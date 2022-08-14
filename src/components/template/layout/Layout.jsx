import Header from './../header/Header';
import Sidebar from './../sidebar/Sidebar';
import Content from './../content/Content';
import './Layout.css'

export default function Layout(props) {
    return (
        <div className="layout-container">
            <div className="header">
                <Header />
            </div>
            <main>
                <Sidebar />
                <Content title={props.title} subtitle={props.subtitle} icon={props.icon}>
                    {props.children}
                </Content>
            </main>
        </div>
    )
}