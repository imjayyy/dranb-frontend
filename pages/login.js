import { Component } from 'react'
import React from "react";
import { Radio } from 'pretty-checkbox-react';
import Select from 'react-select';
import styles from '../styles/Login.module.scss'
import { loginUser, registerUser } from "../services";
import { connect } from "react-redux";
import { setAuth } from "../redux/actions";
import { withRouter } from "next/router";
import Default from "../components/layout/Default";

const countriesNames = require('countries-names');
const countries = countriesNames.all().map(x => ({ value: x.name, label: x.name }))

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginUsername: '',
            loginPassword: '',
            loginError: null,
            registerFirstName: '',
            registerLastName: '',
            registerGender: 1,
            registerBirthdayMM: '',
            registerBirthdayDD: '',
            registerBirthdayYYYY: '',
            registerCountry: '',
            registerEmail: '',
            registerUsername: '',
            registerPassword: '',
            registerPasswordConfirm: '',
            registerError: null
        }
    }

    validator = () => {
        return Object.keys(this.state)
            .filter(x => x.startsWith("register"))
            .find(x => this.state[x].length === 0)
    }

    handleLogin = async (event) => {
        event.preventDefault()
        this.setState({ loginError: null })
        const username = this.state.loginUsername
        const password = this.state.loginPassword

        try {
            const response = await loginUser({
                username: username,
                password: password
            })
            this.setState({
                loginError: null,
            })
            this.props.setAuth(response.data)
            await this.props.router.push("/")
        } catch (error) {
            this.setState({
                loginError: error.response.data
            })
        }
    }

    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    handleRegister = async (event) => {
        event && event.preventDefault()
        this.setState({ registerError: '' })

        try {
            let birthDay = ''
            if (this.state.registerBirthdayYYYY && this.state.registerBirthdayMM && this.state.registerBirthdayDD) {
                birthDay = `${this.state.registerBirthdayYYYY}-${this.state.registerBirthdayMM}-${this.state.registerBirthdayDD}`
            }
            let payload = {
                first_name: this.state.registerFirstName,
                last_name: this.state.registerLastName,
                gender: parseInt(this.state.registerGender),
                country: this.state.registerCountry.value,
                email: this.state.registerEmail,
                username: this.state.registerUsername,
                password: this.state.registerPassword,
                password_confirm: this.state.registerPasswordConfirm
            }
            if (birthDay) {
                payload['birthday'] = birthDay
            }
            let response = await registerUser(payload)
            this.props.setAuth(response.data)
            await this.props.router.push("/")
        } catch (error) {
            this.setState({
                registerError: error.response.data
            })
        }
    }

    render() {
        return (
            <Default>
                <div className="home-top-nav navbar is-fixed-top navbar-d-none mobile-top-bar">
                    <div>login</div>
                </div>
                <div className="container">
                    <div id="page-content">
                        <div id="hero-and-body">
                            <div className={styles.pageBody}>
                                <div className="login columns is-multiline is-mobile">
                                    <div className="column is-5-desktop is-12-touch">
                                        <div className="is-size-4" style={{ height: '80px' }}>Access all the brands and
                                        manage your
                                        selection.
                                        </div>
                                        <form onSubmit={this.handleLogin}>
                                            {this.state.loginError && this.state.loginError.non_field_errors && (
                                                this.state.loginError.non_field_errors.map((message, index) => (
                                                    <div className="notification is-danger" key={index}>
                                                        {message}
                                                    </div>
                                                ))
                                            )}
                                            <div className="field">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={this.state.loginUsername}
                                                    placeholder={"Username"}
                                                    onChange={e => this.setState({ loginUsername: e.target.value })}
                                                />
                                            </div>
                                            <div className="field">
                                                <input
                                                    type="password"
                                                    className="input"
                                                    value={this.state.loginPassword}
                                                    placeholder={"Password"}
                                                    onChange={e => this.setState({ loginPassword: e.target.value })}
                                                />
                                            </div>
                                            <div className="btn field">
                                                <button className="button is-primary" type='submit'>
                                                    Login
                                                </button>
                                            </div>
                                            <div className="password field">
                                                <a className="is-primary">Forgot password?</a>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="column is-2 is-hidden-touch" />
                                    <div className="column is-5-desktop is-12-touch">
                                        <div className="is-size-4 signup-title">
                                            No account? Sign up to access and follow
                                            all your favorite fashion brands.
                                        </div>
                                        <form onSubmit={this.handleRegister}>
                                            <div className="field">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={this.state.registerFirstName}
                                                    name="registerFirstName"
                                                    placeholder={"First Name"}
                                                    required
                                                    onChange={this.handleChange}
                                                />
                                                {this.state.registerError && this.state.registerError.first_name && (
                                                    this.state.registerError.first_name.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className="field">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    name="registerLastName"
                                                    value={this.state.registerLastName}
                                                    placeholder={"Last Name"}
                                                    required
                                                    onChange={this.handleChange}
                                                />
                                                {this.state.registerError && this.state.registerError.last_name && (
                                                    this.state.registerError.last_name.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className="field">
                                                <label>Gender</label>
                                                <div className="is-inline-block">
                                                    <input className="is-checkradio" id="checkbox-women" value="1"
                                                        name="registerGender" type="radio"
                                                        checked={this.state.registerGender == 1}
                                                        onChange={this.handleChange}
                                                    />
                                                    <label htmlFor="checkbox-women">Women</label>
                                                </div>
                                                <div className="is-inline-block">
                                                    <input className="is-checkradio" id="checkbox-men" value="2"
                                                        name="registerGender" type="radio"
                                                        checked={this.state.registerGender == 2}
                                                        onChange={this.handleChange} />
                                                    <label htmlFor="checkbox-men">Men</label>
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label>Birthday</label>
                                                <div className="columns">
                                                    <div className="column">
                                                        <input
                                                            type="text"
                                                            className="input"
                                                            value={this.state.registerBirthdayMM}
                                                            name="registerBirthdayMM"
                                                            placeholder={"MM"}
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                    <div className="column">

                                                        <input
                                                            type="text"
                                                            className="input"
                                                            name="registerBirthdayDD"
                                                            value={this.state.registerBirthdayDD}
                                                            placeholder={"DD"}
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                    <div className="column">

                                                        <input
                                                            className="input"
                                                            type="text"
                                                            name="registerBirthdayYYYY"
                                                            value={this.state.registerBirthdayYYYY}
                                                            placeholder={"YYYY"}
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label>Country</label>
                                                <Select
                                                    value={this.state.registerCountry}
                                                    onChange={e => this.setState({ registerCountry: e })}
                                                    options={countries}
                                                />
                                            </div>
                                            <div className="field">
                                                <input
                                                    type="email"
                                                    className="input"
                                                    name="registerEmail"
                                                    value={this.state.registerEmail}
                                                    placeholder={"Email"}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                                {this.state.registerError && this.state.registerError.email && (
                                                    this.state.registerError.email.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className="field">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    name="registerUsername"
                                                    value={this.state.registerUsername}
                                                    placeholder={"Username"}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                                {this.state.registerError && this.state.registerError.username && (
                                                    this.state.registerError.username.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className="field">
                                                <input
                                                    className="input"
                                                    type="password"
                                                    name="registerPassword"
                                                    value={this.state.registerPassword}
                                                    placeholder={"Password"}
                                                    onChange={this.handleChange}
                                                />
                                                {this.state.registerError && this.state.registerError.password && (
                                                    this.state.registerError.password.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className="field">
                                                <input
                                                    className="input"
                                                    type="password"
                                                    name="registerPasswordConfirm"
                                                    value={this.state.registerPasswordConfirm}
                                                    placeholder={"Password Confirmation"}
                                                    onChange={this.handleChange}
                                                />
                                                {this.state.registerError && this.state.registerError.password_confirm && (
                                                    this.state.registerError.password_confirm.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className="signup field">
                                                <button className="button is-primary">Sign Up</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Default>
        )
    }
}

export default connect(null, { setAuth })(withRouter(Login))
