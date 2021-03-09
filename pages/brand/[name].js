import React, {Component} from 'react'
import config from '../../config/index'
import MasonryLayout from 'react-masonry-layout'
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const repackDebounced = AwesomeDebouncePromise(() => (true), 50);
import Brand from '../../components/layout/Brand'
import {getProductsByBrand} from "../../services";
import {connect} from "react-redux";
import {withRouter} from "next/router";
import styles from "../../styles/Home.module.scss";
import Link from "next/link";

class BrandPage extends Component {
    static async getInitialProps(ctx) {
        const {query} = ctx
        return {brandName: query.name}
    }

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            hasMore: true,
            width: '300px',
            height: '400px',
            filterBy: 1,
            stickyNav: true,
            fullyMounted: false
        }
    }

    async componentDidMount() {
        this.props.toggleLoaded(false)
        await this.getInitialProducts()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.width !== this.state.width)) {
            this.repackItems()
        }
        if (this.props.siteType !== prevProps.siteType) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            this.props.toggleLoaded(false)
            await this.getInitialProducts()
        }
        if (this.props.period !== prevProps.period) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            this.props.toggleLoaded(false)
            await this.getInitialProducts()
        }
        if (this.props.gender !== prevProps.gender) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            this.props.toggleLoaded(false)
            await this.getInitialProducts()
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    getInitialProducts = async () => {
        const brandName = this.props.brandName
        if (!brandName) {
            return;
        }
        try {
            const response = await await getProductsByBrand(this.props.auth.meta.token, brandName, 0, this.props.siteType, this.props.gender, this.props.period)
            this.setState({
                data: response.data,
                dataPage: 1
            }, this.loadMoreProducts)
        } catch (e) {
            console.error(e)
            await this.props.router.push('/login')
        }
        this.props.toggleLoaded(true)
    }

    loadMoreProducts = async () => {
        if (this.state.isLoadingData)
            return
        this.setState({isLoadingData: true}, this.mount)
        try {
            const brandName = this.props.brandName
            if (!brandName) {
                return;
            }
            const response = await getProductsByBrand(this.props.auth.meta.token, brandName, this.state.dataPage, this.props.siteType, this.props.gender, this.props.period)
            let data = response.data

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
        let width
        if (browserWidth <= 768) {
            width = parentWidth
        } else if (browserWidth <= 1024) {
            width = (parentWidth) / 3.3
        } else {
            width = (parentWidth - 60) / 6.3
        }

        let height = width * 5.5 / 3

        this.setState({width, height})
    }

    repackItems = () => {
        const bricksInstance = this.instance.getBricksInstance();
        bricksInstance.pack()
    }

    debounce = async () => {
        await repackDebounced()
        this.repackItems()
    }

    render() {
        const brandName = this.props.brandName
        if (!this.props.loaded) {
            return <div id="page-loader" className="show-logo">
                <span className="loader-icon bullets-jump"><span/><span/><span/></span>
            </div>
        }
        return (
            <Brand brandName={brandName}>
                <div>
                    <div id="page-content">

                        <div id="hero-and-body">
                            {/* PAGEBODY */}
                            <section id="page-body" className="brand-body">
                                {/*<div className="spacer-small" />*/}
                                <div className="wrapper">
                                    {this.props.loaded && (this.state.data.length === 0 && this.state.filterBy === 2) &&
                                    <div>This Brand has no sale styles for the moment.</div>}
                                    <MasonryLayout
                                        ref={instance => this.instance = instance}
                                        id="masonry-layout"
                                        sizes={[{columns: 1, gutter: 20}, {
                                            mq: '769px',
                                            columns: 3,
                                            gutter: 20
                                        }, {mq: '1025px', columns: 6, gutter: 20}]}
                                        infiniteScroll={() => {
                                            this.loadMoreProducts()
                                        }}
                                        infiniteScrollDistance={400}
                                    >

                                        {this.state.data.map((product, i) => {
                                                // let height = i % 2 === 0 ? 200 : 100;
                                                return (
                                                    <div
                                                        className="blog-media"
                                                        key={i}
                                                        style={{
                                                            width: this.state.width,
                                                            height: this.state.height
                                                        }}>
                                                        <a href={product.product_link} target={"_blank"}
                                                           className="thumb-hover scale">
                                                            <img
                                                                onLoad={() => this.debounce()}
                                                                style={{objectFit: 'contain', width: '100%'}}
                                                                src={`${config.domain}/images/${product.image_filename}`}
                                                            />
                                                            <span className={styles.shopNow}>
                                                                shop now
                                                            </span>
                                                        </a>
                                                        <div className="blog-info">
                                                            <div className="is-flex is-justify-content-center mb-2">
                                                                <div className={styles.action}>
                                                                    <button>
                                                                        <i className="fa fa-heart"/><br/>
                                                                        <span>love</span>
                                                                    </button>
                                                                </div>
                                                                <div className={styles.action}>
                                                                    <button>
                                                                        <img src="/icons/board-icon.svg"/><br/>
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
                                                                                <span
                                                                                    className={styles.salePrice}>{product.sale_price}</span>
                                                                                <span
                                                                                    className={styles.oldPrice}>{product.price}</span>
                                                                            </p>
                                                                        ) : (
                                                                            <p className={styles.price}>{product.price}</p>
                                                                        )
                                                                    }
                                                                </a>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}

                                    </MasonryLayout>
                                </div>
                                {/* END .wrapper */}
                            </section>
                            {/* PAGEBODY */}
                        </div>

                    </div>
                </div>


            </Brand>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        siteType: state.brandFilter.siteType,
        period: state.brandFilter.period,
        gender: state.brandFilter.gender
    }
}

export default connect(mapStateToProps)(withRouter(BrandPage))
