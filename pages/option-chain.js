import React from "react"
import Layout from "../components/layout";
import Link from 'next/link'
import Router from 'next/dist/client/router'
import Sticky from 'react-stickynode'

class OptionChain extends React.Component {
    state = {
        originalData: [],
        dataLeft: [],
        sites: [],
        data: [],
        hasMore: true,
        width: '300px',
        filterBy: 1,
        stickyNav: true,
        fullyMounted: false,
        exploreAll: false
    }

    render() {
        return (
            <Layout>
                <div>
                    <div id="page-content">
                        <div id="hero-and-body">
                            <section id="page-body" className="brand-body is-hidden-tablet">
                                <div className="columns is-multiline is-mobile is-hidden-tablet">
                                    <div style={{marginLeft: '10px', marginTop: '15px'}}
                                         className="column is-paddingless brand-text">
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            paddingTop: '10px',
                                            paddingBottom: '20px'
                                        }}>
                                            Mobile Top bar
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/*start page body*/}
                            <section id="page-body">
                                <div className="is-hidden-mobile">
                                    PC top bar
                                </div>
                                <div className="is-hidden-tablet" style={{height: '20px'}}/>
                                {/*start wrapper*/}
                                <div className="wrapper">
                                    Content
                                </div>
                                {/*end wrapper*/}
                            </section>
                            {/*end page body*/}
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default OptionChain
