import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth} from "../../redux/actions";
import Sticky from "react-stickynode";
import TopNavCommon from "../TopNavCommon";

class BoardListLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,
        }
    }

    render() {
        return (
            <>
                <Sticky enabled={this.state.stickyNav} top={0} bottomBoundary={0} innerZ={1500}
                        activeClass={'sticky-active'} releasedClass={'sticky-released'}>
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
                                <p>
                                    Explore and follow boards created by users
                                </p>
                            </>
                        )}
                    </section>
                </Sticky>
                {this.props.children}
            </>
        )
    }
}

BoardListLayout.propTypes = {
    creator: PropTypes.string,
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
    }
}

export default connect(mapStateToProps, {
    setAuth,
})(withRouter(BoardListLayout))
