import React from 'react'
import PropTypes from "prop-types";
import config from "../config";

class Board extends React.Component {
    render() {
        const board = this.props.board
        return (
            <div className="blog-media" style={{
                width: this.props.width
            }}>
                <a className="thumb-hover">
                    <img
                        onLoad={this.props.onLoad}
                        style={{objectFit: 'contain', width: '100%', borderRadius: '10px'}}
                        src={`${config.domain}/images/${board.image_filename}`}
                        alt=""/>
                </a>
                <div className="blog-info">
                    <a>
                        <p>{board.name}</p>
                    </a>
                </div>
            </div>
        )
    }
}

Board.propTypes = {
    width: PropTypes.any.isRequired,
    board: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
}

export default Board
