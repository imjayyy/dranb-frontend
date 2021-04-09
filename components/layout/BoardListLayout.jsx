import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth, setSiteType} from "../../redux/actions";
import Sticky from "react-stickynode";

import Browse from "../bottom_nav/Browse";
import Manage from "../bottom_nav/Manage";
import BottomBar from "../bottom_nav/BottomBar";

import TopNavCommon from "../TopNavCommon";
import Select from "react-select";

class BoardListLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,

            sShowBrowse: false,
            isShowManage: false,
        };
    }

    handleBrowseClose = (value) => {
        this.setState({
            isShowBrowse: value,
        });
    };

    handleManageClose = (value) => {
        this.setState({
            isShowManage: value,
        });
    };

    handleBottomBarSelect = (value) => {
        this.setState(
            {isShowFilter: false, isShowBrowse: false, isShowManage: false},
            () => {
                if (value === 1) {
                    this.props.setSiteType(1);
                    this.props.router.push("/home");
                } else if (value === 2) {
                    this.setState({
                        isShowBrowse: !this.state.isShowBrowse,
                    });
                } else if (value === 4) {
                    this.setState({
                        isShowManage: !this.state.isShowManage,
                    });
                }
            }
        );
    };

    render() {
        return (
            <>
                <div className="home-top-nav navbar is-fixed-top navbar-d-none mobile-top-bar">
                    boards
                    <div>
                        {this.props.creator ? (
                            <button
                                className="go-back"
                                onClick={() => this.props.router.back()}
                            >
                                {"<-"}
                            </button>
                        ) : null}
                    </div>
                </div>

                <Sticky
                    enabled={this.state.stickyNav}
                    top={0}
                    bottomBoundary={0}
                    innerZ={1500}
                    activeClass={"sticky-active"}
                    releasedClass={"sticky-released"}
                >
                    <header>
                        <TopNavCommon/>
                    </header>
                    <section className="board-breadcrumb">
                        {this.props.creator ? (
                            <>
                                <ul>
                                    <li>
                                        <Link href="/boards">
                                            <a>boards</a>
                                        </Link>
                                    </li>
                                    <li className="is-active">
                                        <a>{this.props.creator}</a>
                                    </li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <h3>all boards</h3>
                                <p>Explore and follow boards created by users</p>
                                <div className="hidden-sticky-active">
                                    <Select options={}/>
                                </div>
                            </>
                        )}
                    </section>
                </Sticky>

                {this.state.isShowBrowse ? (
                    <Browse onClose={this.handleBrowseClose}/>
                ) : null}
                {this.state.isShowManage ? (
                    <Manage onClose={this.handleManageClose}/>
                ) : null}
                <BottomBar onSelect={this.handleBottomBarSelect}/>

                {this.props.children}
            </>
        );
    }
}

BoardListLayout.propTypes = {
    creator: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth.auth,
        setSiteType: state.homeFilter.siteType,
    };
};

export default connect(mapStateToProps, {
    setAuth,
    setSiteType,
})(withRouter(BoardListLayout));
