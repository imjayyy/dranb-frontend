import Document, {Html, Head, Main, NextScript} from "next/document";
import React from "react";
import {GA_TRACKING_ID} from "../helpers/gtag";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return {...initialProps}
    }

    render() {
        return (
            <Html>
                <Head>
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}');
                  `
                        }}
                    />
                    <link rel="manifest" href="/static/manifest.json"/>
                    <meta name="apple-mobile-web-app-title" content="Dranbs"/>
                    <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                    <meta name="apple-mobile-web-app-capable" content="yes"/>
                    <meta name="mobile-web-app-capable" content="yes"/>
                    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500" rel="stylesheet"
                          type="text/css"/>

                    <link rel="stylesheet" id="default-style-css" href="/css/style.css" type="text/css"
                          media="all"/>
                    <link rel="stylesheet" id="fontawesome-style-css" href="/fontawesome-pro/css/all.min.css"
                          type="text/css" media="all"/>
                    <link rel="stylesheet" id="ionic-icons-style-css" href="/css/ionicons.css" type="text/css"
                          media="all"/>
                    <link rel="stylesheet" id="responsive-css" href="/css/mqueries.css" type="text/css"
                          media="all"/>

                    <link rel="shortcut icon" href="/static/uploads/favicon.png"/>
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