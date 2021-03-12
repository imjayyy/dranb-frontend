import React from 'react'
import Profile from "../components/layout/Profile";
import {getMyFollowings} from "../services";
import {connect} from "react-redux";
import {setAuth} from "../redux/actions";
import {withRouter} from "next/router";
import MasonryLayout from "react-masonry-layout";
import Board from "../components/Board";
import AwesomeDebouncePromise from "awesome-debounce-promise";

const repackDebounced = AwesomeDebouncePromise(() => (true), 50);

class MyFollowing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            width: '192px',
            fullyMounted: false,
            isLoadingData: false,
            hasMore: true,
        }
    }

    getInitialBoards = async () => {
        try {
            const response = await getMyFollowings(this.props.auth.meta.token, 0)
            if (response.data.length === 0) {
                this.setState({
                    hasMore: false
                })
                this.props.toggleLoaded(true)
                return
            } else {
                this.setState({
                    hasMore: true
                })
            }
            this.setState({
                data: response.data,
                dataPage: 1
            }, this.loadMoreBoards)
            this.props.toggleLoaded(true)
        } catch (e) {
            console.error(e)
            this.props.setAuth(false)
            await this.props.router.push('/login')
        }
    }

    loadMoreBoards = async () => {
        if (this.state.isLoadingData)
            return
        if (!this.state.hasMore)
            return
        this.setState({isLoadingData: true}, this.mount)
        try {
            const response = await getMyFollowings(this.props.auth.meta.token, this.state.dataPage)
            let data = response.data
            if (data.length === 0) {
                this.setState({
                    hasMore: false
                })
                return
            }

            this.setState({
                data: this.state.data.concat(data),
                dataPage: this.state.dataPage + 1,
                isLoadingData: false
            }, this.mount)
        } catch (e) {
            console.error(e)
        }
    }

    mount = () => {
        if (!this.state.fullyMounted) {
            window.addEventListener('resize', this.handleResize);
            const event = new Event('load');
            window.dispatchEvent(event)
            this.props.toggleLoaded(true)
            this.setState({fullyMounted: true}, this.handleResize)
        }
    }

    handleResize = () => {
        const parentWidth = document.querySelector(".wrapper").getBoundingClientRect().width
        const browserWidth = Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
        console.log(`Size: ${parentWidth}px`)
        console.log(`Browser Width: ${browserWidth}px`)
        let width
        if (browserWidth <= 768) {
            width = parentWidth - 100
        } else if (browserWidth <= 1024) {
            width = (parentWidth - 150) / 3
        } else {
            width = (parentWidth - 210) / 11
        }

        this.setState({width})
    }

    repackItems = () => {
        if (this.instance) {
            const bricksInstance = this.instance.getBricksInstance();
            bricksInstance.pack()
        }
    }

    debounce = async () => {
        await repackDebounced()
        this.repackItems()
    }

    async componentDidMount() {
        this.props.toggleLoaded(false)
        await this.getInitialBoards()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.props.toggleLoaded(false)
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.width !== this.state.width)) {
            this.repackItems()
        }
    }

    render() {
        if (!this.props.loaded) {
            return (
                <div id="page-loader" className="show-logo">
                    <span className="loader-icon bullets-jump"><span/><span/><span/></span>
                </div>
            )
        }
        return (
            <Profile headTitle="I follow" headIcon="dashboard">
                <div>
                    <div id="page-content">
                        <div id="hero-and-body">
                            <section id="page-body">
                                <div className="is-hidden-tablet" style={{height: '20px'}}/>
                                <div className="wrapper">
                                    <MasonryLayout
                                        ref={instance => this.instance = instance}
                                        id="masonry-layout"
                                        sizes={[{columns: 1, gutter: 20}, {
                                            mq: '769px',
                                            columns: 3,
                                            gutter: 20
                                        }, {mq: '1025px', columns: 11, gutter: 20}]}
                                        infiniteScroll={async () => {
                                            await this.loadMoreBoards()
                                        }}
                                        infiniteScrollDistance={400}
                                    >
                                        {this.state.data.map((board, i) =>
                                            <Board
                                                width={this.state.width}
                                                board={board} key={i}
                                                onLoad={() => this.debounce()}
                                                showAuthor={true}
                                                isMine={false}
                                            />)}
                                    </MasonryLayout>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </Profile>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
    }
}

export default connect(mapStateToProps, {
    setAuth
})(withRouter(MyFollowing))
