import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import {useRouter, withRouter} from 'next/router';

import styles from './layout.module.scss'


function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

const Layout = props => {
    const [isOpen, toggleMenu] = useState(false);
    // const [user, updateUser] = useStore();
    const router = useRouter();

    useEffect(() => {
        let didCancel = false;

        async function fetchData() {
            // TODO: fetch data from server
        }

        fetchData()
        return () => {
            didCancel = true;
        };
    }, []);

    const menuClassName = () => {
        let changeClass = isOpen ? styles.change : ''
        return `${styles.container} ${changeClass}`
    }

    return (
        <div>
            <header id="header" className={`header-left ${isOpen ? 'menu-is-open' : ''}`}
                    style={{zIndex: '9999999 !important'}}>

                <div className="header-inner clearfix">
                    <div className="is-hidden-tablet">
                        <div className="has-text-weight-bold"
                             style={{position: 'absolute', top: '17px', left: '40px'}}>FNOTrader
                        </div>
                    </div>
                    {/* MAIN NAVIGATION */}
                    <div id="menu" className="clearfix">
                        <div className="menu-actions">

                            <div className="menu-toggle" style={{overflow: 'inherit'}}>

                                <div className="is-hidden-tablet">
                                    <Link href={'/'}>
                                        <a className="is-hidden-mobile" style={{
                                            fontSize: '3rem',
                                            paddingTop: '5px',
                                            fontWeight: 500,
                                            color: 'black'
                                        }}>{isOpen ? 'FNOTrader' : 'F'}</a>
                                    </Link>
                                </div>

                                <div className="is-hidden-mobile" style={{paddingBottom: '30px'}}>
                                    <Link href={'/'}>
                                        <a className="is-hidden-mobile" style={{
                                            fontSize: '3rem',
                                            paddingTop: '5px',
                                            fontWeight: 500,
                                            color: 'black'
                                        }}>{isOpen ? 'FNOTrader' : 'F'}</a>
                                    </Link>
                                </div>

                                <div onClick={() => toggleMenu(!isOpen)}
                                     className={menuClassName()}>
                                    <div className={styles.bar1}/>
                                    <div className={styles.bar2}/>
                                    <div className={styles.bar3}/>
                                </div>
                            </div>
                        </div>
                        {/* END .menu-actions */}
                        <div id="menu-inner" style={{visibility: 'visible'}}>
                            <nav id="main-nav">
                                <ul>
                                    <li><Link href={"/"}><a>Home</a></Link></li>
                                    <li><Link href={"/option-chain"}><a>Option Chain</a></Link></li>
                                </ul>
                            </nav>
                        </div>
                        {/* END #menu-inner */}
                    </div>
                    {/* END #menu */}

                    <div id="header-widget" className="custom">
                        <div className="copyright">Copyright by <a href="https://tradestats.in/">TradeStats.in</a></div>
                    </div>
                </div>
                {/* END .header-inner */}
                {/*<span className="pseudo-close header-close"/>*/}
            </header>
            {props.children}
        </div>
    )
}

export default withRouter(Layout)
