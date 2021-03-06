import React, {Component} from 'react'
import axios from 'axios'
import config from '../../config/index'
import Link from 'next/link'
import {shuffle} from "../../helpers";
import MasonryLayout from 'react-masonry-layout'
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const repackDebounced = AwesomeDebouncePromise(() => (true), 50);
import Layout from '../../components/layout'
import Sticky from 'react-stickynode';
import nextCookie from "next-cookies";
import Router from "next/dist/client/router";
import {getProductsByBrand, getSites} from "../../services";

export default class Name extends Component {
    state = {
        originalData: [],
        dataLeft: [],
        sites: [],
        data: [],
        hasMore: true,
        width: '300px',
        filterBy: 1,
        stickyNav: true,
        fullyMounted: false
    }

    static async getInitialProps(ctx) {
        const {query} = ctx
        const {token} = nextCookie(ctx)

        return {token, brandName: query.name}
    }

    async fetchData() {
        try {
            let dataLeft = []
            const response = await getProductsByBrand(this.props.brandName, 0, this.state.filterBy, this.props.token)
            const response2 = await getSites()
            let sites = response2.data
            this.setState({
                originalData: response.data,
                dataLeft,
                sites,
                dataPage: 1
            }, this.loadMoreImages)
        } catch (e) {
            console.error(e)
            return Router.push('/login')
        }
        this.props.toggleLoaded(true)
    }

    async componentDidMount() {
        this.props.toggleLoaded(false)

        await this.fetchData()

        this.props.toggleLoaded(true)
    }

    initOwlCarousel() {
        var timer = setInterval(function () {
            if (jQuery().owlCarousel) {
                jQuery(".owl-slider").owlCarousel({
                    items: 1,
                    nav: false,
                    navText: false,
                    dots: true,
                    smartSpeed: 600,
                    singleItem: true,
                    autoHeight: true,
                    loop: false,
                    autoplay: false,
                    autoplayHoverPause: true,
                    navRewind: false
                });

                clearInterval(timer)
            }
        }, 200);
    }

    mount = () => {
        if (!this.state.fullyMounted) {
            this.initOwlCarousel()
            window.addEventListener('resize', this.handleResize);
            const event = new Event('load');
            window.dispatchEvent(event)
            this.props.toggleLoaded(true)
            this.setState({fullyMounted: true}, this.handleResize)
        }
    }


    loadMoreImages = async () => {
        let data = this.getNextImageBatch()

        if (data.length <= this.state.data.length + 20) {
            await this.loadMoreData()
            data = this.getNextImageBatch()
        }

        this.setState({data: this.state.data.concat(data.slice(this.state.data.length, this.state.data.length + 20))}, this.mount)
    }

    getNextImageBatch = () => this.state.originalData

    loadMoreData = async () => {
        if (this.state.isLoadingData)
            return
        this.setState({isLoadingData: true}, this.mount)

        const response = await getProductsByBrand(this.props.brandName, this.state.dataPage, this.state.filterBy, this.props.token)
        let data = shuffle(response.data)

        this.setState({
            originalData: this.state.originalData.concat(data),
            dataPage: this.state.dataPage + 1,
            isLoadingData: false
        }, this.mount)
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
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

        this.setState({width})
    }

    repackItems = () => {
        const bricksInstance = this.instance.getBricksInstance();
        bricksInstance.pack()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.width !== this.state.width)) {
            this.repackItems()
        }
        if (prevState.filterBy !== this.state.filterBy) {
            this.initOwlCarousel()
            window.scrollTo({top: 0, behavior: 'smooth'});
            await this.fetchData()
            this.loadMoreImages()
        }
    }

    debounce = async () => {
        await repackDebounced()
        this.repackItems()
    }

    render() {
        const site = this.state.sites.find(site => site.name.toLowerCase() === this.props.brandName.toLowerCase())
        const brandName = site ? site.display_name : this.props.brandName
        if (!this.props.loaded) {
            return <div id="page-loader" className="show-logo">
                <span className="loader-icon bullets-jump"><span/><span/><span/></span>
            </div>
        }
        return (
            <Layout brandName={brandName}>
                <div>
                    <div id="page-content">

                        <div id="hero-and-body">
                            <section id="page-body" className="brand-body is-hidden-tablet">
                                <div className="columns is-multiline is-mobile is-hidden-tablet">
                                    <Link href={"/new-arrivals"}>
                                        <a className="is-hidden-mobile column is-narrow is-marginless">
                                            <img style={{border: '1px solid #64F0E7', padding: '17px'}}
                                                 src={'../static/assets/arrow_back.png'}/>
                                        </a>
                                    </Link>
                                    <div style={{marginLeft: '10px', marginTop: '15px'}}
                                         className="column is-paddingless brand-text">
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            paddingTop: '10px',
                                            paddingBottom: '20px'
                                        }}>
                                            <span
                                                onClick={() => {
                                                    if (this.state.filterBy !== 1) {
                                                        this.props.toggleLoaded(false)
                                                        this.setState({filterBy: 1, data: []})
                                                    }
                                                }
                                                }
                                                style={{
                                                    cursor: 'pointer',
                                                    marginRight: '10px',
                                                    fontSize: '20px',
                                                    color: 'black',
                                                    fontWeight: `${this.state.filterBy === 1 ? '500' : ''}`
                                                }}
                                                // className={`${this.state.filterBy === 1 && "has-text-weight-semibold"}`}
                                            >
                                                New Arrivals</span>

                                            <span
                                                onClick={() => {
                                                    if (this.state.filterBy !== 2) {
                                                        this.props.toggleLoaded(false)
                                                        this.setState({filterBy: 2, data: []})
                                                    }
                                                }
                                                }
                                                style={{
                                                    cursor: 'pointer',
                                                    marginRight: '10px',
                                                    fontSize: '20px',
                                                    color: 'black',
                                                    fontWeight: `${this.state.filterBy === 2 ? '500' : ''}`
                                                }}
                                                // className={`${this.state.filterBy === 2 && "has-text-weight-semibold"}`}
                                            >Sale</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* PAGEBODY */}
                            <section id="page-body" className="brand-body">
                                {/*<div className="spacer-small" />*/}
                                <Sticky enabled={this.state.stickyNav} top={0} bottomBoundary={0} innerZ={1500}
                                        activeClass={'sticky-active'} releasedClass={'sticky-released'}>
                                    {/*<div style={{backgroundColor: 'white', zIndex: '99999999 !important', width: '101%', paddingTop: '20px'}}>*/}
                                    <div className="sticky-container" style={{
                                        backgroundColor: 'white',
                                        zIndex: '99999999 !important',
                                        width: '98%'
                                    }}>


                                        <div className="columns is-multiline is-mobile is-hidden-mobile">
                                            <div>
                                                <Link href={"/new-arrivals"}>
                                                    <a className="is-hidden-mobile column is-narrow is-marginless">
                                                        <img style={{border: '1px solid #64F0E7', padding: '17px'}}
                                                             src={'../static/assets/arrow_back.png'}/>
                                                    </a>
                                                </Link>
                                            </div>
                                            <div style={{marginLeft: '10px', marginTop: '15px'}}
                                                 className="column is-paddingless brand-text">
                                                <div>
                                                    <span style={{
                                                        fontSize: '40px',
                                                        fontWeight: 500,
                                                        color: 'black'
                                                    }}>{brandName}</span>
                                                </div>
                                                <div>
                                                    <span
                                                        onClick={() => {
                                                            if (this.state.filterBy !== 1) {
                                                                this.props.toggleLoaded(false)
                                                                this.setState({filterBy: 1, data: []})
                                                            }
                                                        }
                                                        }
                                                        style={{
                                                            cursor: 'pointer',
                                                            marginRight: '10px',
                                                            fontSize: '20px',
                                                            color: 'black',
                                                            fontWeight: `${this.state.filterBy === 1 ? '500' : ''}`
                                                        }}
                                                        // className={`${this.state.filterBy === 1 && "has-text-weight-semibold"}`}
                                                    >
                                                        New Arrivals</span>

                                                    <span
                                                        onClick={() => {
                                                            if (this.state.filterBy !== 2) {
                                                                this.props.toggleLoaded(false)
                                                                this.setState({filterBy: 2, data: []})
                                                            }
                                                        }
                                                        }
                                                        style={{
                                                            cursor: 'pointer',
                                                            marginRight: '10px',
                                                            fontSize: '20px',
                                                            color: 'black',
                                                            fontWeight: `${this.state.filterBy === 2 ? '500' : ''}`
                                                        }}
                                                        // className={`${this.state.filterBy === 2 && "has-text-weight-semibold"}`}
                                                    >Sale</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </Sticky>
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
                                            this.loadMoreImages()
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

                                                        }}>
                                                        <a href={product.product_link} target={"_blank"}
                                                           className="thumb-hover scale">
                                                            <img
                                                                onLoad={() => this.debounce()}
                                                                style={{objectFit: 'contain', width: '100%'}}
                                                                src={`${config.domain}/images/${product.image_filename}`}
                                                            />
                                                        </a>
                                                        <div className="blog-info">
                                                            <div className="post-meta clearfix">

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
