import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth} from "../../redux/actions";
import Sticky from "react-stickynode";
import BoardModal from "../BoardModal";
import {changeBoardInfo, deleteBoard, getBoardInfo, toggleFollowBoard} from "../../services";
import TopNav from "../TopNav";
import Select from "react-select";
import {IndicatorSeparator, SingleValue, Option} from "../custom-select";
import BoardImageModal from "../BoardImageModal";
import LabelEditable from "../LabelEditable";

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        top: '-7px',
        padding: 0,
        borderRadius: 0,
        fontSize: '14px'
    }),
    menuList: (provided, state) => ({
        ...provided,
        padding: 0,
    }),
    control: (provided) => ({
        ...provided,
        border: 'unset',
        borderRadius: 0,
        fontSize: '14px'
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'black'
    }),
}

class Boards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,
            followers: 0,
            isFollowing: false,
            description: '',
            optionIndex: 1,
            imageFilename: null,
            isImageModalActive: false
        }
    }

    options = [
        {value: 0, label: 'Private', icon: 'far fa-lock-alt', },
        {value: 1, label: 'Public', icon: 'far fa-globe-americas'},
    ]

    async componentDidMount() {
        if (this.props.name) {
            try {
                const data = await getBoardInfo(this.props.auth.meta.token, this.props.name)
                this.setState({
                    followers: data.followers,
                    isFollowing: data.is_following,
                    description: data.description,
                    optionIndex: data.type,
                    imageFilename: data.image_filename
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

    showImageModal = () => {
        this.setState({
            isImageModalActive: true
        })
    }

    closeImageModal = () => {
        document.getElementsByTagName('html')[0].style.overflowY = 'scroll'
        this.setState({
            isImageModalActive: false
        })
    }

    handleOptionChange = async (newOption) => {
        try {
            await changeBoardInfo(this.props.auth.meta.token, this.props.name, {
                type: newOption.value
            })
            this.setState({
                optionIndex: newOption.value
            })
        } catch (e) {
            console.error(e)
        }
    }

    handleDeleteClicked = async () => {
        let r = confirm('Are you sure to delete this board?')
        if (r) {
            try {
                await deleteBoard(this.props.auth.meta.token, this.props.name)
                await this.props.router.push('/my-boards')
            } catch (e) {
                console.error(e)
            }
        }
    }

    handleBoardNameChange = async (value) => {
        if (value !== this.props.name) {
            try {
                await changeBoardInfo(this.props.auth.meta.token, this.props.name, {
                    name: value
                })
                await this.props.router.push(`/boards/${this.props.creator}`)
            } catch (e) {
                console.error(e)
            }
        }
    }

    handleBoardDescriptionChange = async (value) => {
        try {
            await changeBoardInfo(this.props.auth.meta.token, this.props.name, {
                description: value
            })
            await this.props.router.push(`/boards/${this.props.creator}`)
        } catch (e) {
            console.error(e)
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
                                                {this.props.isMine ? (
                                                    <LabelEditable className="head" value={this.props.name} onChange={this.handleBoardNameChange} />
                                                ) : (
                                                    <a>{this.props.name}</a>
                                                )}
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
                                        <>
                                            {/*{this.props.isMine ? (*/}
                                            {/*    <LabelEditable className="desc" value={this.state.description} onChange={this.handleBoardDescriptionChange} />*/}
                                            {/*) : (*/}
                                                <p>{this.state.description}</p>
                                            {/*)}*/}
                                        </>
                                        <div className="follow-piece">
                                            {!this.props.isMine && (
                                                <button
                                                    className={this.state.isFollowing ? 'unfollow' : 'follow'}
                                                    onClick={() => this.toggleFollow(this.props.name)}
                                                >
                                                    {this.state.isFollowing ? 'unfollow' : 'follow'}
                                                </button>
                                            )}
                                            <span className="followers">{this.state.followers} followers</span>
                                            {this.props.isMine && (
                                                <>
                                                    <button
                                                        className="hidden-sticky-active"
                                                        onClick={() => {
                                                            document.getElementsByTagName('html')[0].style.overflowY = 'hidden'
                                                            this.showImageModal()
                                                        }}
                                                    >
                                                        Change board image
                                                    </button>
                                                    <div className="hidden-sticky-active" style={{display: 'inline-block', width: '120px'}}>
                                                        <Select
                                                            options={this.options}
                                                            value={this.options[this.state.optionIndex]}
                                                            styles={customStyles}
                                                            components={{Option, SingleValue, IndicatorSeparator}}
                                                            onChange={this.handleOptionChange}
                                                        />
                                                    </div>
                                                    <button onClick={this.handleDeleteClicked}>delete board</button>
                                                </>
                                            )}
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
                {this.state.imageFilename && (
                    <BoardImageModal
                        imageFilename={this.state.imageFilename}
                        isActive={this.state.isImageModalActive}
                        boardName={this.props.name}
                        onClose={() => this.closeImageModal()}
                    />)}
            </>
        )
    }
}

Boards.propTypes = {
    isMine: PropTypes.bool.isRequired,
    creator: PropTypes.string,
    name: PropTypes.string
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
    }
}

export default connect(mapStateToProps, {
    setAuth,
})(withRouter(Boards))
