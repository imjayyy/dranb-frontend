import React from 'react'
import PropTypes from 'prop-types'
import config from "../config";
import styles from "./product.module.scss";
import Link from "next/link";
import {DashboardOutlined, FavoriteBorderOutlined} from "@material-ui/icons";

class Product extends React.Component {
    render() {
        const product = this.props.product

        return (
            <div className="blog-media" style={{
                width: this.props.width
            }}>
                <a href={product.product_link} target={"_blank"}
                   className="thumb-hover scale">
                    <img
                        onLoad={this.props.onLoad}
                        style={{objectFit: 'contain', width: '100%'}}
                        src={`${config.domain}/images/${product.image_filename}`}
                    />
                    <span className={styles.shopNow}>shop now</span>
                </a>
                <div className="blog-info">
                    <div className="is-flex is-justify-content-center mb-2">
                        <div className={styles.action}>
                            <button>
                                <FavoriteBorderOutlined fontSize={'20px'} /><br/>
                                <span>love</span>
                            </button>
                        </div>
                        <div className={styles.action}>
                            <button>
                                <DashboardOutlined fontSize={'18px'} /><br/>
                                <span>+ board</span>
                            </button>
                        </div>
                    </div>
                    <Link href={product.product_link}>
                        <a target="_blank" className={styles.productDetail}>
                            <p className={styles.productTitle}>{product.title}</p>
                            {
                                product.sale_price ? (
                                    <p className={styles.price}>
                                        <span className={styles.salePrice}>{product.sale_price}</span>
                                        <span className={styles.oldPrice}>{product.price}</span>
                                    </p>
                                ) : (
                                    <p className={styles.price}>{product.price}</p>
                                )
                            }
                        </a>
                    </Link>
                    {!this.props.isBrand && (
                        <Link href={`brand/${product.name}`}>
                            <a>
                                <p className={styles.brandName}>{product.display_name} ></p>
                            </a>
                        </Link>
                    )}
                </div>
            </div>
        )
    }
}

Product.propTypes = {
    width: PropTypes.any.isRequired,
    product: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    isBrand: PropTypes.bool.isRequired,
}

export default Product
