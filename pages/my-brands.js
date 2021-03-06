import React, {Component} from 'react';
import Router from 'next/router'
import nextCookie from 'next-cookies'
import Layout from '../components/layout'
import {withAuthSync} from '../utils/auth'
import {Checkbox, Radio} from 'pretty-checkbox-react';
import {getMyProfile, toggleUsersSites} from "../services";

const combineBothStates = (allSites, myProfiles) => {
    return allSites.reduce((acc, site) => {
        const siteAlreadyExists = acc.findIndex(x => x.name === site.display_name)
        const used = !!myProfiles.find(x => x.site_id === site.id)
        if (siteAlreadyExists === -1) {
            const newSite = {
                name: site.display_name,
                short_url: site.short_url,
                data: [{gender: site.gender, used, ids: [site.id]}]
            }
            return acc.concat([newSite])
        } else {
            const sameGenderIndex = acc[siteAlreadyExists].data.findIndex(x => x.gender === site.gender)
            // This gender doesn't exist and needs to be added
            if (sameGenderIndex === -1) {
                const data = acc[siteAlreadyExists].data
                const existingGender = acc[siteAlreadyExists].data[0].gender
                let modifiedSite
                if (existingGender === 1) {
                    modifiedSite = {
                        ...acc[siteAlreadyExists],
                        data: acc[siteAlreadyExists].data.concat({gender: site.gender, used, ids: [site.id]})
                    }
                } else {
                    modifiedSite = {
                        ...acc[siteAlreadyExists],
                        data: [{gender: site.gender, used, ids: [site.id]}].concat(acc[siteAlreadyExists].data)
                    }
                }
                acc[siteAlreadyExists] = modifiedSite
                return acc
            } else {
                acc[siteAlreadyExists].data[sameGenderIndex].ids = acc[siteAlreadyExists].data[sameGenderIndex].ids.concat([site.id])
                if (!!acc[siteAlreadyExists].data[sameGenderIndex].used === false && used) {
                    acc[siteAlreadyExists].data[sameGenderIndex].used = true
                }
                return acc
            }
        }
    }, [])
}

class MyBrands extends Component {
    static async getInitialProps(ctx) {
        const {token, _boilerplate_key} = nextCookie(ctx)

        const redirectOnError = () => {
            if (process.browser) {
                Router.push('/login')
            } else {
                const res = ctx.res
                res.writeHead(302, {
                    Location: '/login'
                })
                res.end()
                res.finished = true
                return {}
            }
        }

        try {

            const initData = await getMyProfile(token)
            return {initData, token, _boilerplate_key}
        } catch (error) {
            // Implementation or Network error
            return redirectOnError()
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            filter: null
        }
    }

    componentDidMount() {
        const {initData} = this.props
        const mapped = combineBothStates(initData.sites, initData.my_profiles)
        this.setState({
            data: mapped
        })
    }

    update = async (gender, site) => {
        try {
            const data = await toggleUsersSites({
                data: {
                    used: gender.used,
                    ids: gender.ids,
                    site: site.name
                }
            }, this.props.token)
            const mapped = combineBothStates(data.sites, data.my_profiles)
            this.setState({
                data: mapped
            });
        } catch (error) {
            // Implementation or Network error
            console.log(error)
        }
    }

    render() {
        const {data} = this.state
        return (
            <Layout>
                <div id="page-content">
                    <div id="hero-and-body">
                        <div id="page-body">
                            <div className="main-columns">
                                <div className="my-brands-sidebar">
                                    <div className="is-size-3 is-hidden-mobile" style={{color: 'black'}}>my Brands</div>
                                    <div className="is-size-6">Select and follow all your favorite fashion brands.</div>
                                    <br/>
                                    <br/>
                                    <div className="has-text-weight-bold is-size-7">View</div>
                                    <div className="columns is-multiline is-gapless is-mobile">
                                        <div className="column is-12-desktop filter-class"><Radio
                                            onChange={() => this.setState({filter: null})}
                                            checked={this.state.filter === null}>All</Radio></div>
                                        <div className="column is-12-desktop filter-class"><Radio
                                            onChange={() => this.setState({filter: 1})}
                                            checked={this.state.filter === 1}>Women</Radio></div>
                                        <div className="column is-12-desktop filter-class"><Radio
                                            onChange={() => this.setState({filter: 2})}
                                            checked={this.state.filter === 2}>Men</Radio></div>
                                    </div>
                                </div>
                                <div className="my-brands-main">

                                    <div className="brands-main-columns columns is-multiline">
                                        {data.sort((a, b) => a.name.localeCompare(b.name)).map(site => {
                                            if (this.state.filter === 1 || this.state.filter === 2) {
                                                const res = site.data.find(x => x.gender === this.state.filter)
                                                if (!res) {
                                                    return <div key={site.name}/>
                                                }
                                            }
                                            const usedAtLeastOnce = site.data.find(x => x.used)
                                            return <div key={site.name} style={{
                                                backgroundColor: `${usedAtLeastOnce ? '#d9f9f6' : ''}`,
                                                margin: '5px !important'
                                            }}
                                                        className="column site-item is-narrow-desktop is-narrow-tablet is-12-mobile is-paddingless is-marginless">
                                                <div style={{margin: '10px'}}
                                                     className="columns is-multiline is-mobile is-gapless">
                                                    <div style={{
                                                        marginBottom: 0,
                                                        paddingBottom: 0,
                                                        fontWeight: 500,
                                                        fontSize: '1.2rem'
                                                    }} className="column is-12 has-text-black-bis is-paddingless">
                                                        {site.name}
                                                    </div>
                                                    <div className="column is-12 is-marginless is-paddingless">
                                                        <a href={`https://${site.short_url}`} target={"_blank"}
                                                           style={{textDecoration: 'underline'}}
                                                           className="">{site.short_url}</a>
                                                    </div>
                                                    {site.data.map(gender => (
                                                        <div key={`${site.id}-${gender.gender}`}>
                                                            {(this.state.filter === null || this.state.filter === gender.gender) &&
                                                            <span
                                                                className="gender-item column is-paddingless is-marginless">
                                                    <Checkbox
                                                        color="black"
                                                        animation="smooth"
                                                        shape="curve"
                                                        checked={gender.used}
                                                        onChange={() => this.update(gender, site)}
                                                    >{gender.gender === 1 ? 'Women' : 'Men'}</Checkbox>
                                                </span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        })}
                                    </div>

                                </div>
                                {/*eslint-disable*/}
                                {/*language=CSS*/}
                                <style jsx global>{`
                                    label {
                                        color: black;
                                    }

                                    #page-body {
                                        margin-top: 40px;
                                    }

                                    .site-item {
                                        padding: 20px !important;
                                        margin: 5px !important;
                                    }

                                    @media (max-width: 769px) {
                                        #page-body {
                                            padding-left: 30px;
                                            padding-right: 30px;
                                        }

                                        .gender-item {
                                            width: 40% !important;
                                            margin: 0 !important;
                                        }

                                        .main-columns {
                                            padding: 20px 30px 0px 30px;
                                        }

                                        .filter-class {
                                            width: 33%;
                                        }

                                        .filter-class:nth-child(1) {
                                            width: 23%;
                                        }

                                        .my-brands-sidebar {
                                            padding-bottom: 20px;
                                        }

                                        .site-item {
                                            /*width: 100vw !important;*/
                                            /*position: absolute;*/
                                            /*left: 0;*/
                                        }


                                    }

                                    @media (min-width: 769px) {
                                        .site-item {
                                            width: 250px !important;
                                        }

                                        .main-columns {
                                            padding: 50px 5px 50px 50px;
                                        }

                                        .my-brands-sidebar {
                                            position: fixed;
                                            width: 200px;
                                        }

                                        .my-brands-main {
                                            padding-left: 300px;
                                        }
                                    }

                                    .gender-item:last-of-type {
                                        min-height: 60px;
                                    }

                                `}</style>
                                {/*eslint-enable*/}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default withAuthSync(MyBrands)
