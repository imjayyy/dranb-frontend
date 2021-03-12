import React from 'react'
import Link from 'next/link'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth, setExploreType, setGender, setPeriod, setSiteType} from "../../redux/actions";
import Sticky from "react-stickynode";
import BoardModal from "../BoardModal";
import {getBoardInfo, toggleFollowBoard} from "../../services";
import TopNav from "../TopNav";

class Boards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,
            followers: 0,
            isFollowing: false
        }
    }

    async componentDidMount() {
        if (this.props.name) {
            try {
                const data = await getBoardInfo(this.props.auth.meta.token, this.props.name)
                this.setState({
                    followers: data.followers,
                    isFollowing: data.is_following,
                })
            } catch (e) {
                this.props.setAuth(false)
                await this.props.router.push("/login")
            }
        }
    }

    toggleFollow = async (boardName) => {
        try {
            const data = await toggleFollowBoard(this.props.auth.meta.token, boardName)
            this.setState({
                followers: data.followers,
                isFollowing: data.is_following
            })
        } catch (e) {
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
                    <section className="board-breadcrumb">
                        {this.props.creator ? (
                            <>
                                <ul>
                                    <li>
                                        <Link href="/boards">
                                            <a>boards</a>
                                        </Link>
                                    </li>
                                    {this.props.name ? (
                                        <>
                                            <li>
                                                <Link href={`/boards/${this.props.creator}`}>
                                                    <a>{this.props.creator}</a>
                                                </Link>
                                            </li>
                                            <li className="is-active">
                                                <a>{this.props.name}</a>
                                            </li>
                                        </>
                                    ) : (
                                        <li className="is-active">
                                            <a>{this.props.creator}</a>
                                        </li>
                                    )}
                                </ul>
                                {this.props.name && (
                                    <>
                                        <p>
                                            Suscipit purus dignissim quaerat magnis molestie minima eiusmod nunc, nulla
                                            maxime proin
                                        </p>
                                        <div className="follow-piece">
                                            <button
                                                className={this.state.isFollowing ? 'unfollow' : 'follow'}
                                                onClick={() => this.toggleFollow(this.props.name)}
                                            >
                                                {this.state.isFollowing ? 'unfollow' : 'follow'}
                                            </button>
                                            <span className="followers">{this.state.followers} followers</span>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <h3>all boards</h3>
                                <p>
                                    Suscipit purus dignissim quaerat magnis molestie minima eiusmod nunc, nulla maxime
                                    proin
                                </p>
                            </>
                        )}
                    </section>
                </Sticky>
                {this.props.children}
                <BoardModal/>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        siteType: state.homeFilter.siteType,
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
})(withRouter(Boards))
