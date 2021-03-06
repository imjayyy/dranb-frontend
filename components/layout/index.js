import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import {useRouter, withRouter} from 'next/router';
import {FaArrowLeft} from 'react-icons/fa';
import Router from 'next/router'
import {useStore, store} from "../../hooks/currentUser";
import axios from "axios";
import config from "../../config";
import styles from "./layout.module.scss"
import {getUser} from "../../services";

const showOnArrow = ["/my-brands"]


const getName = (props) => {
    if (props.router.asPath === "/my-brands") {
        return "my Brands"
    } else if (props.brandName) {
        return props.brandName
    }
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

const Layout = props => {
    const [isOpen, toggleMenu] = useState(false);
    const [user, updateUser] = useStore();
    const router = useRouter();

    useEffect(() => {
        let didCancel = false;

        async function fetchData() {
            let data
            try {
                data = await getUser()
                if (props.updateUser) {
                    props.updateUser(data.data)
                }
                updateUser(data.data);
            } catch (e) {
                console.log(531, e)
                updateUser(false)
            }
        }

        fetchData()
        return () => {
            didCancel = true;
        };
    }, []);
    return (
        <div>
            <header id="header" className={`header-left ${isOpen ? 'menu-is-open' : ''}`}
                    style={{zIndex: '9999999 !important'}}>

                <div className="header-inner clearfix">
                    {(showOnArrow.includes(props.router.asPath) || props.router.asPath.includes("/brand/")) &&
                    <div className="is-hidden-tablet">
                        <Link href={"/new-arrivals"}><span
                            style={{position: 'absolute', top: '20px', left: '30px'}}><FaArrowLeft size={'1.6em'}
                                                                                                   color={'#64F0E7'}/></span></Link>
                        <div className="has-text-weight-bold"
                             style={{position: 'absolute', top: '17px', left: '60px'}}>{getName(props)}</div>
                    </div>}
                    {props.router.asPath === "/" &&
                    <div className="is-hidden-tablet">
                        <div className="has-text-weight-bold"
                             style={{position: 'absolute', top: '17px', left: '40px'}}>Dranbs
                        </div>
                    </div>}
                    {/* MAIN NAVIGATION */}
                    <div id="menu" className="clearfix">
                        <div className="menu-actions">

                            <div className="menu-toggle" style={{overflow: 'inherit'}}>

                                <div className="is-hidden-tablet">
                                    <Link href={'/new-arrivals'}>
                                        <a className="is-hidden-mobile" style={{
                                            fontSize: '3rem',
                                            paddingTop: '5px',
                                            fontWeight: 500,
                                            color: 'black'
                                        }}>{isOpen ? 'Dranbs' : 'D'}</a>
                                    </Link>
                                </div>

                                <div className="is-hidden-mobile" style={{paddingBottom: '30px'}}>
                                    <Link href={'/new-arrivals'}>
                                        <a className="is-hidden-mobile" style={{
                                            fontSize: '3rem',
                                            paddingTop: '5px',
                                            fontWeight: 500,
                                            color: 'black'
                                        }}>{isOpen ? 'Dranbs' : 'D'}</a>
                                    </Link>
                                </div>

                                <div onClick={() => toggleMenu(!isOpen)}
                                     className={`${styles.container} ${isOpen ? 'change' : ''}`}>
                                    <div className={styles.bar1}></div>
                                    <div className={styles.bar2}></div>
                                    <div className={styles.bar3}></div>
                                </div>
                            </div>
                        </div>
                        {/* END .menu-actions */}
                        <div id="menu-inner" style={{visibility: 'visible'}}>
                            <nav id="main-nav">

                                <ul>
                                    <li style={{paddingRight: '20px'}}>We embrace styles diversity. Follow all your
                                        favorite fashion brands in one place.
                                    </li>
                                </ul>
                                <br/>
                                <ul>
                                    <li><Link href={"/new-arrivals"}><a>Home</a></Link></li>
                                    <li><Link href={"/my-profile"}><a>My Profile</a></Link></li>
                                    <li><Link href={"/my-brands"}><a>My Brands</a></Link></li>

                                    <li><Link href={"/contact"}><a>Contact</a></Link></li>
                                    {user ? <li onClick={() => {
                                            var cookies = document.cookie.split(";");

                                            for (var i = 0; i < cookies.length; i++) {
                                                var cookie = cookies[i];
                                                var eqPos = cookie.indexOf("=");
                                                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                                                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                            }
                                            Router.push("/")
                                            window.location.reload()
                                        }}><a>Logout</a></li> :
                                        <li><Link href={"/login"}><a>Login</a></Link></li>

                                    }
                                </ul>
                            </nav>
                        </div>
                        {/* END #menu-inner */}
                    </div>
                    {/* END #menu */}

                    <div id="header-widget" className="custom">
                        {/*<div className="copyright">Copyright by <a href="http://g-nesia.com">G-nesia</a></div>*/}
                    </div>
                </div>
                {/* END .header-inner */}
                <span className="pseudo-close header-close"/>
            </header>
            {props.children}
        </div>
    )
}

export default withRouter(Layout)
