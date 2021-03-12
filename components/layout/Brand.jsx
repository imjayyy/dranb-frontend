import React from 'react'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {
    setAuth,
    setBrandGender, setBrandPeriod,
    setBrandSiteType, setSiteType,
} from "../../redux/actions";
import Sticky from "react-stickynode";
import {getBrandInfo, toggleFollowBrand} from "../../services";
import BoardModal from "../BoardModal";
import TopNav from "../TopNav";

class Brand extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,
            followers: 0,
            is_following: false,
            genders: 1,
        }
    }

    async componentDidMount() {
        try {
            const data = await getBrandInfo(this.props.auth.meta.token, this.props.brandName)
            this.setState({
                followers: data.followers,
                is_following: data.is_following,
                genders: data.genders
            })
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push("/login")
        }
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
        return (
            <>
                <Sticky enabled={this.state.stickyNav} top={0} bottomBoundary={0} innerZ={1500}
                        activeClass={'sticky-active'} releasedClass={'sticky-released'}>
                    <header>
                        <TopNav />
                    </header>
                    <section className="filter">
                        <div className="brand-name">
                            <button className="go-back" onClick={() => this.props.router.back()}>{'<-'}</button>
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
                                <button className={this.state.is_following ? 'unfollow' : 'follow'}
                                        onClick={() => this.toggleFollow(this.props.brandName)}>
                                    {this.state.is_following ? 'unfollow' : 'follow'}
                                </button>
                            </div>
                            <div className="filter-item">
                                {this.state.followers} followers
                            </div>
                            {
                                this.state.genders === 2 && (
                                    <div className="filter-item">
                                        <a onClick={() => this.props.setBrandGender(0)}
                                           className={`${this.props.gender === 0 ? 'is-active' : ''}`}>all</a>
                                        <a onClick={() => this.props.setBrandGender(1)}
                                           className={`${this.props.gender === 1 ? 'is-active' : ''}`}>women</a>
                                        <a onClick={() => this.props.setBrandGender(2)}
                                           className={`${this.props.gender === 2 ? 'is-active' : ''}`}>men</a>
                                    </div>
                                )
                            }
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
                <BoardModal />
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
