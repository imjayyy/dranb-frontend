import React, {Component} from 'react'
import config from '../config/index'
import Link from 'next/link'
import MasonryLayout from 'react-masonry-layout'
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const repackDebounced = AwesomeDebouncePromise(() => (true), 50);
import Main from '../components/layout/Main'
import {getHomeData} from "../services";
import {connect} from "react-redux";
import {withRouter} from "next/router";

import styles from '../styles/Home.module.scss'

class IndexPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            width: '300px',
            stickyNav: true,
            fullyMounted: false,
        }
    }

    async componentDidMount() {
        this.props.toggleLoaded(false)
        await this.getInitialProducts()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.props.toggleLoaded(false)
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.width !== this.state.width)) {
            this.repackItems()
        }
        if (this.props.siteType !== prevProps.siteType) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            await this.getInitialProducts()
        }
        if (this.props.exploreType !== prevProps.exploreType) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            await this.getInitialProducts()
        }
        if (this.props.gender !== prevProps.gender) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            await this.getInitialProducts()
        }
    }

    getInitialProducts = async () => {
        try {
            const response = await getHomeData(this.props.auth.meta.token, 0, this.props.siteType, this.props.exploreType, this.props.gender)
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
        try {
            const response = await getHomeData(this.props.auth.meta.token, this.state.dataPage, this.props.siteType, this.props.exploreType, this.props.gender)
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
        console.log(`Browser Width: ${browserWidth}px`)
        let width
        if (browserWidth <= 768) {
            width = parentWidth
        } else if (browserWidth <= 1024) {
            width = (parentWidth) / 3.3
        } else {
            width = (parentWidth - 60) / 6.3
        }

        this.setState({width})
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
        if (!this.props.loaded) {
            return <div id="page-loader" className="show-logo">
                <span className="loader-icon bullets-jump"><span/><span/><span/></span>
            </div>
        }

        return (
            <Main>
                <div>

                    <div id="page-content">
                        <div id="hero-and-body">
                            {/* PAGEBODY */}
                            {this.props.loaded && ((this.state.data.length === 0 && this.props.loaded && this.state.fullyMounted) &&
                                <div className={styles.afterRegister}>
                                    <p className="has-text-centered">you have no brands in <strong>"my selection"</strong> filters.</p>
                                    <p className="has-text-centered">
                                        To follow brands just <strong>explore</strong> and visit a<br />
                                        brand page, then click on the follow button.
                                    </p>
                                </div>)}
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
                                        }, {mq: '1025px', columns: 6, gutter: 20}]}
                                        infiniteScroll={async () => {
                                            await this.loadMoreProducts()
                                        }}
                                        infiniteScrollDistance={400}
                                    >


                                        {this.state.data.map((product, i) => {
                                                return (
                                                    <div
                                                        className="blog-media"
                                                        key={i}
                                                        style={{
                                                            width: this.state.width,
                                                            // height: `${height}px`,
                                                            // lineHeight: `${height}px`,
                                                            // color: 'white',
                                                            // fontSize: '32px',
                                                            // display: 'block',
                                                            // background: 'rgba(0,0,0,0.7)'
                                                        }}>
                                                        <a href={product.product_link} target={"_blank"}
                                                           className={`thumb-hover scale ${styles.thumbnail}`}>
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
                                                            <Link href={`brand/${product.name}`}>
                                                                <a>
                                                                    <p className={styles.brandName}>{product.display_name} ></p>
                                                                </a>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}

                                    </MasonryLayout>
                                    {/*</div>*/}
                                </div>
                                {/* END .wrapper */}
                            </section>
                            {/* PAGEBODY */}
                        </div>

                    </div>
                </div>
            </Main>

        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        siteType: state.homeFilter.siteType,
        exploreType: state.homeFilter.exploreType,
        gender: state.homeFilter.gender
    }
}

export default connect(mapStateToProps)(withRouter(IndexPage))
