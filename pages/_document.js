import Document, {Html, Head, Main, NextScript} from "next/document";
import React from "react";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return {...initialProps}
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta charSet="utf-8"/>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                    <meta name="description" content="FNOTrader"/>
                    <meta name="keywords" content="FNO,Trader"/>

                    <link rel="manifest" href="/manifest.json"/>
                    <meta name="apple-mobile-web-app-title" content="FNOTrader"/>
                    <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                    <meta name="apple-mobile-web-app-capable" content="yes"/>
                    <meta name="mobile-web-app-capable" content="yes"/>
                    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500" rel="stylesheet"
                          type="text/css"/>

                    <link rel="stylesheet" href="/css/style.css" type="text/css"/>
                    <link rel="stylesheet" href="/fontawesome-pro/css/all.min.css" type="text/css"/>
                    <link rel="stylesheet" href="/css/ionicons.css" type="text/css"/>
                    <link rel="stylesheet" href="/css/mqueries.css" type="text/css"/>

                    <link
                        href="/icons/favicon-16x16.png"
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                    />
                    <link
                        href="/icons/favicon-32x32.png"
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                    />
                    <link rel="apple-touch-icon" href="/apple-icon.png"></link>
                    <meta name="theme-color" content="#317EFB"/>
                    <link rel="shortcut icon" href="/favicon.ico"/>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                <script src="/jquery/jquery.min.js"></script>
                <script src="/js/plugins.js" type="text/javascript"></script>
                <script src="/js/jquery.sticky-kit.min.js" type="text/javascript"></script>
                <script src="/js/script.js" type="text/javascript"></script>
                </body>
            </Html>
        )
    }
}

export default MyDocument
