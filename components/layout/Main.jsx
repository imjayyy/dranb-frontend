import React from 'react'
import styles from "./layout.module.scss"
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth, setExploreType, setGender, setPeriod} from "../../redux/actions";
import Sticky from "react-stickynode";
import {getUser} from "../../services";
import BoardModal from "../BoardModal";
import TopNav from "../TopNav";
import PropTypes from "prop-types";

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,
        }
    }

    componentDidMount() {
        if (this.props.auth) {
            getUser(this.props.auth.meta.token)
                .then(res => {
                    console.log(res)
                })
                .catch(e => {
                    console.error(e)
                    this.props.setAuth(false)
                })
        }
    }

    render() {
        return (
            <>
                <Sticky enabled={this.state.stickyNav} top={0} bottomBoundary={0} innerZ={1500}
                        activeClass={'sticky-active'} releasedClass={'sticky-released'}>
                    <header>
                        <TopNav/>
                    </header>
                    <section className="filter">
                        <div className="is-flex">
                            <div className={styles.filterTitle}>
                                <img src="/icons/slider.svg"/>
                                filters
                            </div>
                            <div className="filter-item">
                                <a onClick={() => this.props.setExploreType(true)}
                                   className={`${this.props.exploreType ? 'is-active' : ''}`}>explore</a>
                                <a onClick={() => this.props.setExploreType(false)}
                                   className={`${!this.props.exploreType ? 'is-active' : ''}`}>my selection</a>
                            </div>
                            <div className="filter-item">
                                <a onClick={() => this.props.setGender(0)}
                                   className={`${this.props.gender === 0 ? 'is-active' : ''}`}>all</a>
                                <a onClick={() => this.props.setGender(1)}
                                   className={`${this.props.gender === 1 ? 'is-active' : ''}`}>women</a>
                                <a onClick={() => this.props.setGender(2)}
                                   className={`${this.props.gender === 2 ? 'is-active' : ''}`}>men</a>
                            </div>
                            <div className="filter-item">
                                <a onClick={() => this.props.setPeriod(-1)}
                                   className={`${this.props.period === -1 ? 'is-active' : ''}`}>all</a>
                                <a onClick={() => this.props.setPeriod(1)}
                                   className={`${this.props.period === 1 ? 'is-active' : ''}`}>today</a>
                                <a onClick={() => this.props.setPeriod(7)}
                                   className={`${this.props.period === 7 ? 'is-active' : ''}`}>one week</a>
                            </div>
                        </div>
                    </section>
                </Sticky>
                {this.props.children}
                <BoardModal onToggleSaved={this.props.onToggleSaved}/>
            </>
        )
    }
}

Main.propTypes = {
    onToggleSaved: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        exploreType: state.homeFilter.exploreType,
        gender: state.homeFilter.gender,
        period: state.homeFilter.period
    }
}

export default connect(mapStateToProps, {
    setAuth,
    setExploreType,
    setGender,
    setPeriod
})(withRouter(Main))
