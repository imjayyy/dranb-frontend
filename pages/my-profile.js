import {Component} from 'react'
import React from "react";
import {Radio} from 'pretty-checkbox-react';

const countriesNames = require('countries-names');
import Select from 'react-select';

const countries = countriesNames.all().map(x => ({value: x.name, label: x.name}))
import {getProfile, patchProfile} from "../services";
import {connect} from "react-redux";
import {withRouter} from "next/router";
import Default from "../components/layout/Default";
import { setAuth, setSiteType } from "../redux/actions";

import Browse from "../components/bottom_nav/Browse"
import Manage from "../components/bottom_nav/Manage"
import BottomBar from "../components/bottom_nav/BottomBar"

class MyProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: '',
            lastName: '',
            gender: '1',
            birthdayMM: '',
            birthdayDD: '',
            birthdayYYYY: '',
            country: '',
            email: '',
            password: '',
            passwordAgain: '',
            error: null,
            message: '',
            isShowBrowse: false, 
            isShowManage: false,
        }
    }

    componentDidMount() {
        getProfile(this.props.auth.meta.token).then(data => {
            const [year, month, day] = data.data.birthday ? data.data.birthday.split("-") : ["", "", ""]
            let gender
            switch (data.gender) {
                case 1:
                    gender = "1"
                    break
                case 2:
                    gender = "2"
                    break
                default:
                    gender = "1"
            }
            this.setState({
                firstName: data.data.first_name,
                lastName: data.data.last_name,
                gender: gender,
                country: {label: data.data.country, value: data.data.country},
                email: data.data.email,
                username: data.data.username,
                birthdayMM: month,
                birthdayDD: day,
                birthdayYYYY: year,
            })
        }).catch(error => {
            this.props.setAuth(false)
            this.props.router.push('/login')
        })
    }

    handleBrowseClose = (value) => {
        this.setState({
          isShowBrowse: value,
          isShowFilterButton: true
        })
      }
    
    handleManageClose = (value) => {
        this.setState({
          isShowManage: value,
          isShowFilterButton: true
        })
    }
    
    handleBottomBarSelect = (value) => {
        this.setState({isShowBrowse: false, isShowManage: false}, ()=>{
            if (value === 1) {
                this.props.setSiteType(1)
                this.props.router.push('/')
            } else if (value === 2) {
                this.setState({
                  isShowBrowse: !this.state.isShowBrowse
                })
            } else if (value === 4) {
                this.setState({
                    isShowManage: !this.state.isShowManage
                })
            }
        })
    }


    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    updateProfile = async (event) => {
        event && event.preventDefault()
        this.setState({error: null})

        try {
            let birthDay = ''
            if (this.state.registerBirthdayYYYY && this.state.registerBirthdayMM && this.state.registerBirthdayDD) {
                birthDay = `${this.state.registerBirthdayYYYY}-${this.state.registerBirthdayMM}-${this.state.registerBirthdayDD}`
            }
            let payload = {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                gender: parseInt(this.state.gender),
                country: this.state.country.value,
                email: this.state.email,
                username: this.state.username,
            }
            if (birthDay) {
                payload['birthday'] = birthDay
            }
            if (this.state.password || this.state.passwordAgain) {
                payload['password'] = this.state.password
                payload['password_confirm'] = this.state.passwordAgain
            }
            await patchProfile(this.props.auth.meta.token, payload)
            this.setState({
                message: 'Success !'
            })
        } catch (error) {
            this.setState({
                error: error.response.data
            })
        }
    }

    render() {
        return (
            <Default>
                <div className="navbar is-fixed-top navbar-d-none mobile-top-bar">
                    <div>my profile</div>
                </div>
                <div className="container" style={{padding: '20px'}}>
                    <div id="page-content">
                        <div id="hero-and-body">
                            <div id="page-body">
                                <div className="columns is-multiline is-mobile my-5">
                                    <div className="column is-5-desktop is-12-touch">
                                        {this.state.message && (
                                            <div className="notification is-success">
                                                {this.state.message}
                                            </div>
                                        )}
                                        <form onSubmit={this.updateProfile}>
                                            <div className="field">
                                                <label className="label">Username</label>
                                                <input
                                                    disabled
                                                    type="text"
                                                    className="input"
                                                    value={this.state.username}
                                                />
                                            </div>
                                            <div className="field">
                                                <label className="label">First Name</label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    name="firstName"
                                                    value={this.state.firstName}
                                                    placeholder={"First Name"}
                                                    onChange={this.handleChange}
                                                />
                                                {this.state.error && this.state.error.first_name && (
                                                    this.state.error.first_name.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className="field">
                                                <label className="label">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={this.state.lastName}
                                                    name="lastName"
                                                    className="input"
                                                    placeholder={"Last Name"}
                                                    onChange={this.handleChange}
                                                />
                                                {this.state.error && this.state.error.last_name && (
                                                    this.state.error.last_name.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className="field">
                                                <label className="label">Gender</label>
                                                <div>
                                                    <div className="is-inline-block">
                                                        <input className="is-checkradio" id="checkbox-women" value="1"
                                                               name="gender" type="radio"
                                                               checked={this.state.gender == 1}
                                                               onChange={this.handleChange}
                                                        />
                                                        <label htmlFor="checkbox-women">Women</label>
                                                    </div>
                                                    <div className="is-inline-block">
                                                        <input className="is-checkradio" id="checkbox-men" value="2"
                                                               name="gender" type="radio"
                                                               checked={this.state.gender == 2}
                                                               onChange={this.handleChange}/>
                                                        <label htmlFor="checkbox-men">Men</label>
                                                    </div>
                                                </div>
                                                {this.state.error && this.state.error.gender && (
                                                    this.state.error.gender.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className="field">
                                                <label className="label">Birthday</label>
                                                <div className="columns">
                                                    <div className="column">
                                                        <input
                                                            type="text"
                                                            className="input"
                                                            name="birthdayMM"
                                                            value={this.state.birthdayMM}
                                                            placeholder={"MM"}
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                    <div className="column">

                                                        <input
                                                            type="text"
                                                            className="input"
                                                            value={this.state.birthdayDD}
                                                            name="birthdayDD"
                                                            placeholder={"DD"}
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                    <div className="column">

                                                        <input
                                                            type="text"
                                                            className="input"
                                                            value={this.state.birthdayYYYY}
                                                            name="birthdayYYYY"
                                                            placeholder={"YYYY"}
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                {this.state.error && this.state.error.birthday && (
                                                    this.state.error.birthday.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className="field">
                                                <label className="label">Country</label>
                                                <Select
                                                    // style={{width: '100%'}}
                                                    value={this.state.country}
                                                    onChange={e => this.setState({country: e})}
                                                    options={countries}
                                                    instanceId="key"
                                                />
                                                {this.state.error && this.state.error.country && (
                                                    this.state.error.country.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className="field">
                                                <label className="label">Email</label>
                                                <input
                                                    type="email"
                                                    className="input"
                                                    name="email"
                                                    value={this.state.email}
                                                    placeholder={"Email"}
                                                    onChange={this.handleChange}
                                                />
                                                {this.state.error && this.state.error.email && (
                                                    this.state.error.email.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>

                                            <br/>
                                            <br/>
                                            <br/>

                                            <div className="field">
                                                <label className="label">Leave empty unless you want to change
                                                    it</label>
                                                <input
                                                    type="password"
                                                    className="input"
                                                    name="password"
                                                    value={this.state.password}
                                                    placeholder={"New Password"}
                                                    onChange={this.handleChange}
                                                />
                                                {this.state.error && this.state.error.password && (
                                                    this.state.error.password.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>

                                            <div className="field">
                                                <input
                                                    type="password"
                                                    className="input"
                                                    name="passwordAgain"
                                                    value={this.state.passwordAgain}
                                                    placeholder={"New Password Again"}
                                                    onChange={this.handleChange}
                                                />
                                                {this.state.error && this.state.error.password_confirm && (
                                                    this.state.error.password_confirm.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>

                                            <div className="field">
                                                <button className="button is-primary" type='submit'>
                                                    Update
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.isShowBrowse ? <Browse onClose={this.handleBrowseClose}/> : null}
                {this.state.isShowManage ? <Manage onClose={this.handleManageClose}/> : null}
                <BottomBar onSelect={this.handleBottomBarSelect}/>
            </Default>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        setSiteType: state.homeFilter.siteType,
    }
}

export default connect(mapStateToProps, {
    setAuth,
    setSiteType,
})(withRouter(MyProfile))
