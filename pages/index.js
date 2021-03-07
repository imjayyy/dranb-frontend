import React, {Component} from 'react'
import config from '../config/index'
import Link from 'next/link'
import MasonryLayout from 'react-masonry-layout'
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const repackDebounced = AwesomeDebouncePromise(() => (true), 50);
import Layout from '../components/layout'
import {getHomeData} from "../services";
import {connect} from "react-redux";
import {withRouter} from "next/router";

import styles from '../styles/Home.module.scss'

class IndexPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            originalData: [],
            dataLeft: [],
            sites: [],
            data: [],
            hasMore: true,
            width: '300px',
            filterBy: 1,
            stickyNav: true,
            fullyMounted: false,
            exploreAll: false,
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
            <Layout>
                <div>

                    <div id="page-content">
                        <div id="hero-and-body">
                            {/* PAGEBODY */}
                            {this.props.loaded && ((this.state.data.length === 0 && this.props.loaded && this.state.fullyMounted && this.state.user) &&
                                <div className={styles.afterRegister}>
                                    {this.state.filterBy === 1 ? <div>
                                            <h2>Follow your favorite brands.</h2>
                                            <h3><Link href={'/my-brands'}><a style={{textDecoration: 'underline'}}>Click on
                                                my Brands to select them.</a></Link></h3>
                                        </div> :
                                        <div>
                                            <h2>Selected brands have no sale styles.</h2>
                                            <h3><Link href={'/my-brands'}><a style={{textDecoration: 'underline'}}>Click
                                                on my Brands to select additional brands.</a></Link></h3>
                                        </div>
                                    }
                                </div>)}

                            {this.props.loaded && ((this.state.data.length === 0 && this.props.loaded && this.state.fullyMounted && !this.state.user) &&
                                <div className={styles.afterRegister}>
                                    {this.state.filterBy === 1 ? <div>
                                            <h2>There are no sale styles.</h2>
                                        </div> :
                                        <div>
                                            <h2>There are no sale styles.</h2>
                                        </div>
                                    }
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
                                                            <div className="post-meta clearfix">
                                                            <span className="post-cat">
                                                                <Link href={`brand?name=${product.name}`}
                                                                      as={`brand/${product.name}`}>
                                                                    <a>{product.display_name} <span style={{
                                                                        color: '#64F0E7',
                                                                        marginLeft: '10px'
                                                                    }}>more...</span></a>
                                                                </Link>
                                                            </span>
                                                            </div>
                                                            <h4 className="post-name" style={{marginTop: '0px'}}>
                                                                <a href={product.product_link}
                                                                   target={"_blank"}>{product.title}</a>
                                                            </h4>
                                                            {product.sale_price ? <div>
                                                                    <span className="post-pricebar">{product.price}</span>
                                                                    <span className="post-pricesale">{product.sale_price}</span>
                                                                </div> :
                                                                <span className="post-price">{product.price}</span>
                                                            }
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
            </Layout>

        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        siteType: state.siteType.siteType,
        exploreType: state.exploreType.exploreType,
        gender: state.gender.gender
    }
}

export default connect(mapStateToProps)(withRouter(IndexPage))
