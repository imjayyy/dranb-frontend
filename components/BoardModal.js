import React from 'react'
import {connect} from "react-redux";
import {setModalActive} from "../redux/actions";
import Select, {components} from "react-select";
import {createBoard, getBoards} from "../services";
import BoardCheckbox from "./BoardCheckbox";

class SingleValue extends React.Component {
    render() {
        return (
            <components.SingleValue {...this.props}>
                <i className={this.props.data.icon} style={{marginRight: "5px"}}/>
                {this.props.data.label}
            </components.SingleValue>
        )
    }
}

class Option extends React.Component {
    render() {
        return (
            <components.Option {...this.props}>
                <i className={this.props.data.icon} style={{marginRight: "5px"}}/>
                {this.props.data.label}
            </components.Option>
        )
    }
}

const IndicatorSeparator = ({innerProps}) => {
    return <></>
}

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        top: '-9px',
        padding: 0,
        borderRadius: 0
    }),
    menuList: (provided, state) => ({
        ...provided,
        padding: 0,
    }),
    control: (provided) => ({
        ...provided,
        border: 'unset',
        borderBottom: 'solid 1px black',
        borderRadius: 0,
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'black'
    }),
}

class BoardModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayForm: false,
            boardName: '',
            boardType: 1,
            boards: []
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isModalActive !== prevProps.isModalActive && this.props.isModalActive) {
            const response = await getBoards(this.props.auth.meta.token, '', this.props.productId)
            this.setState({
                boards: response.data
            })
        }
    }

    options = [
        {value: 1, label: 'Public', icon: 'far fa-globe-americas'},
        {value: 0, label: 'Private', icon: 'far fa-lock-alt'},
    ]

    showNewBoardForm = () => {
        this.setState({
            displayForm: true
        })
    }

    handleBackgroundClick = () => {
        this.props.setModalActive(false)
    }

    handleOptionChange = (newOption) => {
        this.setState({
            boardType: newOption.value
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const data = await createBoard(this.props.auth.meta.token, {
                board_name: this.state.boardName,
                board_type: this.state.boardType,
                product_id: this.props.productId
            })
            let boards = this.state.boards
            boards.push(data.board)
            this.setState({
                boards: boards,
                boardName: '',
                displayForm: false
            }, () => {
                this.props.setModalActive(false)
            })
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        return (
            <div className={`modal ${this.props.isModalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={this.handleBackgroundClick}/>
                <div className="modal-content" style={{width: '320px'}}>
                    <div className="create-theme">
                        <header className="create-theme-head">
                            <p>
                                Save to
                                <button onClick={() => {
                                    document.getElementsByTagName('html')[0].style.overflowY = 'auto'
                                    this.props.setModalActive(false)
                                }}>X</button>
                            </p>
                        </header>
                        <div className="create-theme-body">
                            <div className="board-list">
                                {this.state.boards.map((board, index) => (
                                    <BoardCheckbox
                                        board={board} key={`${index}_${board.followed}`} index={index}
                                        productId={this.props.productId} token={this.props.auth.meta.token}/>
                                ))}
                            </div>
                        </div>
                        <footer className="create-theme-foot">
                            {
                                !this.state.displayForm &&
                                <button className="button show-form" onClick={() => this.showNewBoardForm()}>+ create
                                    new board</button>
                            }
                            {
                                this.state.displayForm && (
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="field">
                                            <label className="label">Board name</label>
                                            <input
                                                type="text" className="input"
                                                value={this.state.boardName}
                                                onChange={(event) => this.setState({boardName: event.target.value})}
                                                placeholder="Enter the name here"/>
                                        </div>
                                        <div className="field">
                                            <label className="label">Confidentiality</label>
                                            <Select
                                                options={this.options}
                                                defaultValue={this.options[0]}
                                                styles={customStyles}
                                                components={{Option, SingleValue, IndicatorSeparator}}
                                                onChange={this.handleOptionChange}
                                            />
                                        </div>
                                        <div className="field has-text-right">
                                            <button className="button create-board">create</button>
                                        </div>
                                    </form>
                                )
                            }
                        </footer>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        isModalActive: state.boardModal.isActive,
        productId: state.boardModal.productId
    }
}

export default connect(mapStateToProps, {
    setModalActive
})(BoardModal)
