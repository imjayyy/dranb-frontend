import React from 'react'
import App from "next/app";
import Head from "next/head";
import Router from 'next/router'
import * as gtag from '../helpers/gtag'

import '../styles/globals.scss'

Router.events.on('routeChangeComplete', url => gtag.pageview(url))

class MyApp extends App {
    state = {loaded: false}

    static async getInitialProps({Component, ctx}) {
        let pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return {pageProps}
    }

    toggleLoaded = (neww) => {
        this.setState({loaded: neww})
    }

    render() {
        const {Component, pageProps} = this.props

        return (
            <>
                <Head>
                    <meta name="viewport"
                          content="height=device-height,width=device-width, initial-scale=1.0, user-scalable=0"/>
                    <title>Dranbs / inspire your styles</title>
                </Head>
                <Component {...pageProps} toggleLoaded={this.toggleLoaded} loaded={this.state.loaded}/>
            </>
        )
    }
}

export default MyApp
