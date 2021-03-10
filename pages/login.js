import {Component} from 'react'
import Main from '../components/layout/Main'
import React from "react";
import {Radio} from 'pretty-checkbox-react';
import Select from 'react-select';
import styles from '../styles/Login.module.scss'
import {loginUser, registerUser} from "../services";
import {connect} from "react-redux";
import {setAuth} from "../redux/actions";
import {withRouter} from "next/router";

const countriesNames = require('countries-names');
const countries = countriesNames.all().map(x => ({value: x.name, label: x.name}))

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginUsername: '',
            loginPassword: '',
            registerFirstName: '',
            registerLastName: '',
            registerGender: '1',
            registerBirthdayMM: '',
            registerBirthdayDD: '',
            registerBirthdayYYYY: '',
            registerCountry: '',
            registerEmail: '',
            registerUsername: '',
            registerPassword: '',
            registerPasswordConfirm: '',
            error: ''
        }
    }

    validator = () => {
        return Object.keys(this.state)
            .filter(x => x.startsWith("register"))
            .find(x => this.state[x].length === 0)
    }

    handleSubmit = async (event) => {
        event && event.preventDefault()
        this.setState({error: ''})
        const username = this.state.loginUsername
        const password = this.state.loginPassword

        try {
            const response = await loginUser({
                username: username,
                password: password
            })
            this.props.setAuth(response.data)
            await this.props.router.push("/")
        } catch (error) {
            console.error(
                'You have an error in your code or there are Network issues.',
                error
            )
            this.setState({error: error.message})
        }
    }

    register = async (event) => {
        event && event.preventDefault()
        this.setState({error: ''})

        try {
            let response = await registerUser({
                first_name: this.state.registerFirstName,
                last_name: this.state.registerLastName,
                gender: parseInt(this.state.registerGender),
                birthday: `${this.state.registerBirthdayYYYY}-${this.state.registerBirthdayMM}-${this.state.registerBirthdayDD}`,
                country: this.state.registerCountry.value,
                email: this.state.registerEmail,
                username: this.state.registerUsername,
                password: this.state.registerPassword,
                password_confirm: this.state.registerPasswordConfirm
            })
            this.props.setAuth(response.data)
            await this.props.router.push("/")
        } catch (error) {
            console.error(
                'You have an error in your code or there are Network issues.',
                error
            )
            this.setState({error: error.message})
        }
    }

    render() {
        const disable = !!this.validator()
        // console.log(55, disable)
        return (
            <Main>
                <div className="container">
                    <div id="page-content">
                        <div id="hero-and-body">
                            <div className={styles.pageBody}>
                                <div style={{marginLeft: '30px', paddingRight: '60px'}}
                                     className="columns is-multiline is-mobile">

                                    <div className="column is-5-desktop is-12-touch is-paddingless is-marginless">
                                        <form className="form" onSubmit={this.handleSubmit}>
                                            <div className="columns is-multiline is-mobile">
                                                <div style={{height: '110px'}} className="column is-12">
                                                    <div className="is-size-4">Access all the brands and manage your
                                                        selection.
                                                    </div>
                                                </div>
                                                <div className="column is-12 is-marginless">
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        value={this.state.loginUsername}
                                                        placeholder={"Username"}
                                                        onChange={e => this.setState({loginUsername: e.target.value})}
                                                    />
                                                </div>
                                                <div style={{paddingTop: '0px'}}
                                                     className="column is-12  is-marginless">
                                                    <input
                                                        type="password"
                                                        className="input"
                                                        value={this.state.loginPassword}
                                                        placeholder={"Password"}
                                                        onChange={e => this.setState({loginPassword: e.target.value})}
                                                    />
                                                </div>
                                                <div className="column is-12">
                                                    <button className="button" type='submit'>
                                                        Login
                                                    </button>
                                                </div>
                                                <div className="column is-6">
                                                    <a style={{color: '#64F0E7'}}>Forgot password?</a>
                                                </div>
                                                <div className="column is-12">
                                                    <p className={`error ${this.state.error && 'show'}`}>
                                                        {this.state.error && `Error: ${this.state.error}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="column is-1 is-hidden-touch"/>

                                    <div className="column is-5-desktop is-12-touch is-paddingless is-marginless">
                                        <form className="form" onSubmit={this.register}>
                                            <div className="columns is-multiline is-mobile">
                                                <div style={{heigth: '80px'}} className="column is-12">
                                                    <p className="is-size-4">No account? Sign up to access and follow
                                                        all your favorite fashion brands.</p>
                                                </div>
                                                <div className="column is-12 is-marginless">
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        value={this.state.registerFirstName}
                                                        placeholder={"First Name"}
                                                        onChange={e => this.setState({registerFirstName: e.target.value})}
                                                    />
                                                </div>
                                                <div style={{paddingTop: '0px'}}
                                                     className="column is-12  is-marginless">
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        value={this.state.registerLastName}
                                                        placeholder={"Last Name"}
                                                        onChange={e => this.setState({registerLastName: e.target.value})}
                                                    />
                                                </div>
                                                <div style={{paddingTop: '0px'}}
                                                     className="column is-12 is-marginless">
                                                    <label>Gender</label>
                                                    <>
                                                        <Radio onChange={e => this.setState({registerGender: "1"})}
                                                               checked={this.state.registerGender === "1"}
                                                               name="1">Women</Radio>
                                                        <Radio onChange={e => this.setState({registerGender: "2"})}
                                                               checked={this.state.registerGender === "2"}
                                                               name="2">Men</Radio>
                                                    </>
                                                </div>
                                                <div style={{paddingTop: '0px'}}
                                                     className="column is-12  is-marginless">
                                                    <label>Birthday</label>
                                                    <div className="columns">
                                                        <div className="column">
                                                            <input
                                                                type="text"
                                                                className="input"
                                                                value={this.state.registerBirthdayMM}
                                                                placeholder={"MM"}
                                                                onChange={e => this.setState({registerBirthdayMM: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="column">

                                                            <input
                                                                type="text"
                                                                className="input"
                                                                value={this.state.registerBirthdayDD}
                                                                placeholder={"DD"}
                                                                onChange={e => this.setState({registerBirthdayDD: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="column">

                                                            <input
                                                                className="input"
                                                                type="text"
                                                                value={this.state.registerBirthdayYYYY}
                                                                placeholder={"YYYY"}
                                                                onChange={e => this.setState({registerBirthdayYYYY: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{paddingTop: '0px', paddingRight: '0px'}}
                                                     className="column is-12  is-marginless is-gapless">
                                                    <label>Country</label>
                                                    <Select
                                                        // style={{width: '100%'}}
                                                        value={this.state.registerCountry}
                                                        onChange={e => this.setState({registerCountry: e})}
                                                        options={countries}
                                                    />
                                                </div>
                                                <div style={{paddingTop: '0px'}}
                                                     className="column is-12  is-marginless">
                                                    <input
                                                        type="email"
                                                        className="input"
                                                        value={this.state.registerEmail}
                                                        placeholder={"Email"}
                                                        onChange={e => this.setState({registerEmail: e.target.value})}
                                                    />
                                                </div>
                                                <div style={{paddingTop: '0px'}}
                                                     className="column is-12  is-marginless">
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        value={this.state.registerUsername}
                                                        placeholder={"Username"}
                                                        onChange={e => this.setState({registerUsername: e.target.value})}
                                                    />
                                                </div>
                                                <div style={{paddingTop: '0px'}}
                                                     className="column is-12  is-marginless">
                                                    <input
                                                        className="input"
                                                        type="password"
                                                        value={this.state.registerPassword}
                                                        placeholder={"Password"}
                                                        onChange={e => this.setState({registerPassword: e.target.value})}
                                                    />
                                                </div>
                                                <div style={{paddingTop: '0px'}}
                                                     className="column is-12  is-marginless">
                                                    <input
                                                        className="input"
                                                        type="password"
                                                        value={this.state.registerPasswordConfirm}
                                                        placeholder={"Password Confirmation"}
                                                        onChange={e => this.setState({registerPasswordConfirm: e.target.value})}
                                                    />
                                                </div>
                                                <div className="column is-12">
                                                    <button
                                                        className="button" type='submit' disabled={disable} style={{
                                                        background: `${disable ? 'grey !important' : ''}`,
                                                        cursor: `${disable ? 'not-allowed' : ''}`
                                                    }}>Sign Up
                                                    </button>
                                                </div>
                                                <div className="column is-12">
                                                    <p className={`error ${this.state.error && 'show'}`}>
                                                        {this.state.error && `Error: ${this.state.error}`}
                                                    </p>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Main>
        )
    }
}

export default connect(null, {setAuth})(withRouter(Login))
