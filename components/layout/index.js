import React from 'react'
import Link from 'next/link'
import styles from "./layout.module.scss"
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth, setSiteType} from "../../redux/actions";
import Sticky from "react-stickynode";

class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true
        }
    }

    handleLogout = () => {
        this.props.setAuth(false)
        this.props.router.push('/login')
    }

    render() {
        const router = this.props.router
        return (
            <>
                <Sticky enabled={this.state.stickyNav} top={0} bottomBoundary={0} innerZ={1500}
                        activeClass={'sticky-active'} releasedClass={'sticky-released'}>
                    <header>
                        <nav className="navbar">
                            <div className="navbar-menu">
                                <div className="navbar-start is-flex-direction-column">
                                    <Link href={"/"}>
                                        <h1 className="brand">DRANBS<small>/ inspire your styles</small></h1>
                                    </Link>
                                    <div className="is-flex">
                                        <a className={`navbar-item p-0 mx-2 ${this.props.siteType == 1 ? 'is-active' : ''}`} onClick={() => this.props.setSiteType(1)}>
                                            new arrivals
                                        </a>
                                        <a className={`navbar-item p-0 mx-2 ${this.props.siteType == 2 ? 'is-active' : ''}`} onClick={() => this.props.setSiteType(2)}>sale</a>
                                        <Link href="/boards">
                                            <a className={`navbar-item p-0 mx-2 ${router.pathname == '/boards' ? 'is-active' : ''}`}>boards</a>
                                        </Link>
                                    </div>
                                </div>
                                <div className="navbar-end">
                                    <div className="navbar-item">
                                        <div className="field">
                                            <p className="control has-icons-right">
                                                <input className="input" type="text" placeholder="Search"/>
                                                <span className="icon is-small is-right">
                                            <i className="fa fa-search"/>
                                        </span>
                                            </p>
                                        </div>
                                    </div>
                                    {this.props.auth ? (
                                        <>
                                            <Link href="/loves">
                                                <a className="navbar-item">
                                                    <i className="fa fa-heart"/>
                                                    I love
                                                </a>
                                            </Link>
                                            <Link href="/following">
                                                <a className="navbar-item">
                                                    <img src="/icons/follow-icon.svg"/>
                                                    I follow
                                                </a>
                                            </Link>
                                            <div className="navbar-item has-dropdown is-hoverable">
                                                <a className="navbar-link">
                                                    {this.props.auth.user.username}
                                                </a>

                                                <div className="navbar-dropdown">
                                                    <a className="navbar-item">
                                                        My boards
                                                    </a>
                                                    <Link href="/my-profile">
                                                        <a className="navbar-item">
                                                            my profile
                                                        </a>
                                                    </Link>
                                                    <Link href="/contact">
                                                        <a className="navbar-item">
                                                            contact us
                                                        </a>
                                                    </Link>
                                                    <a className="navbar-item" onClick={this.handleLogout}>
                                                        log out
                                                    </a>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <Link href="/login">
                                            <a className="navbar-item">login / sign up</a>
                                        </Link>
                                    )}

                                </div>
                            </div>
                        </nav>
                    </header>
                    <section className="filter">
                        <div className="is-flex">
                            <div className={styles.filterTitle}>
                                <img src="/icons/slider.svg"/>
                                filters
                            </div>
                            <div className={styles.filterItem}>
                                <a href="">explore</a>
                                <a href="">my selection</a>
                            </div>
                            <div className={styles.filterItem}>
                                <a href="">all</a>
                                <a href="">women</a>
                                <a href="">men</a>
                            </div>
                            <div className={styles.filterItem}>
                                <a href="">all</a>
                                <a href="">today</a>
                                <a href="">one week</a>
                            </div>
                        </div>
                    </section>
                </Sticky>
                {this.props.children}
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        siteType: state.siteType.siteType
    }
}

export default connect(mapStateToProps, {setAuth, setSiteType})(withRouter(Layout))
