import React from 'react'
import Link from 'next/link'
import PropTypes from "prop-types";
import config from "../config";
import styles from './board.module.scss'

class Board extends React.Component {
    render() {
        const board = this.props.board
        return (
            <div className={`blog-media ${styles.board}`} style={{
                width: this.props.width
            }}>
                <Link href={`/boards/${board.username}/${board.slug}`}>
                    <a className="thumb-hover">
                        <img
                            onLoad={this.props.onLoad}
                            src={`${config.domain}/images/${board.image_filename}`}
                            alt=""/>
                    </a>
                </Link>
                <div className="blog-info" style={{paddingLeft: '10px'}}>
                    <Link href={`/boards/${board.username}/${board.slug}`}>
                        <a>
                            <p className={styles.name}>{board.name}</p>
                        </a>
                    </Link>
                    {this.props.showAuthor && (
                        <Link href={`/boards/${board.username}`}>
                            <a>
                                <p className={styles.creator}>by <strong>{board.username}</strong></p>
                            </a>
                        </Link>
                    )}
                    <p className={styles.followers}>{board.followers} followers</p>
                </div>
            </div>
        )
    }
}

Board.propTypes = {
    width: PropTypes.any.isRequired,
    board: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    showAuthor: PropTypes.bool.isRequired,
}

export default Board
