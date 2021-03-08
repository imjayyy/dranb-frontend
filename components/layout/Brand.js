import React from 'react'
import Link from 'next/link'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {
    setAuth,
    setBrandGender, setBrandPeriod,
    setBrandSiteType, setSiteType,
} from "../../redux/actions";
import Sticky from "react-stickynode";
import {getBrandInfo, toggleFollowBrand} from "../../services";

class Brand extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,
            followers: 0,
            is_following: false
        }
    }

    async componentDidMount() {
        try {
            const data = await getBrandInfo(this.props.auth.meta.token, this.props.brandName)
            this.setState({
                followers: data.followers,
                is_following: data.is_following
            })
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push("/login")
        }
    }

    handleLogout = async () => {
        this.props.setAuth(false)
        await this.props.router.push('/login')
    }

    handleClick = async (siteType) => {
        this.props.setSiteType(siteType)
        await this.props.router.push('/')
    }

    toggleFollow = async (brandName) => {
        try {
            const data = await toggleFollowBrand(this.props.auth.meta.token, brandName)
            this.setState({
                followers: data.followers,
                is_following: data.is_following
            })
        } catch (e) {
            console.error(e)
            this.props.setAuth(false)
            await this.props.router.push('/login')
        }
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
                                        <a className="navbar-item p-0 mx-2"
                                           onClick={() => this.handleClick(1)}>
                                            new arrivals
                                        </a>
                                        <a className="navbar-item p-0 mx-2"
                                           onClick={() => this.handleClick(2)}>sale</a>
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
                        <div className="brand-name">
                            <button className="go-back">{'<-'}</button>
                            <span>{this.props.brandName}</span>
                        </div>
                        <div className="is-flex is-align-items-center">
                            <div className="filter-item">
                                <a onClick={() => this.props.setBrandSiteType(1)}
                                   className={`${this.props.brandSiteType === 1 ? 'is-active' : ''}`}>new arrivals</a>
                                <a onClick={() => this.props.setBrandSiteType(2)}
                                   className={`${this.props.brandSiteType === 2 ? 'is-active' : ''}`}>sale</a>
                            </div>
                            <div className="filter-item">
                                <button className={this.state.is_following ? 'unfollow' : 'follow'} onClick={() => this.toggleFollow(this.props.brandName)}>
                                    {this.state.is_following ? 'unfollow' : 'follow'}
                                </button>
                            </div>
                            <div className="filter-item">
                                {this.state.followers} followers
                            </div>
                            <div className="filter-item">
                                <a onClick={() => this.props.setBrandGender(0)}
                                   className={`${this.props.gender === 0 ? 'is-active' : ''}`}>all</a>
                                <a onClick={() => this.props.setBrandGender(1)}
                                   className={`${this.props.gender === 1 ? 'is-active' : ''}`}>women</a>
                                <a onClick={() => this.props.setBrandGender(2)}
                                   className={`${this.props.gender === 2 ? 'is-active' : ''}`}>men</a>
                            </div>
                            <div className="filter-item">
                                <a onClick={() => this.props.setBrandPeriod(-1)}
                                   className={`${this.props.period === -1 ? 'is-active' : ''}`}>all</a>
                                <a onClick={() => this.props.setBrandPeriod(1)}
                                   className={`${this.props.period === 1 ? 'is-active' : ''}`}>today</a>
                                <a onClick={() => this.props.setBrandPeriod(7)}
                                   className={`${this.props.period === 7 ? 'is-active' : ''}`}>one week</a>
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
        siteType: state.homeFilter.siteType,
        brandSiteType: state.brandFilter.siteType,
        gender: state.brandFilter.gender,
        period: state.brandFilter.period
    }
}

export default connect(mapStateToProps, {
    setAuth,
    setSiteType,
    setBrandSiteType,
    setBrandGender,
    setBrandPeriod
})(withRouter(Brand))
