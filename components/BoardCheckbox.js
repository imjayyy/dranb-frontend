import React from 'react'
import PropTypes from 'prop-types'
import {toggleProductSaved} from "../services";

class BoardCheckbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: false,
            followed: false
        }
    }

    componentDidMount() {
        this.setState({
            checked: this.props.board.followed,
            followed: this.props.board.followed
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.productId !== prevProps.productId) {
            this.setState({
                checked: this.props.board.followed,
                followed: this.props.board.followed
            })
        }
    }

    handleChange = async (event) => {
        try {
            const data = await toggleProductSaved(this.props.token, {
                product: this.props.productId,
                board: this.props.board.id
            })
            this.setState({
                followed: data.followed,
                checked: data.followed,
            })
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        return (
            <div className="field is-relative">
                <input className="is-checkradio is-black" type="checkbox" checked={this.state.checked} id={`checkbox${this.props.index}`} onChange={this.handleChange} />
                <label htmlFor={`checkbox${this.props.index}`}>{this.props.board.name}</label>
                {this.state.followed && <span className="saved">saved</span>}
            </div>
        )
    }
}

BoardCheckbox.propTypes = {
    board: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
    productId: PropTypes.number.isRequired,
}

export default BoardCheckbox
