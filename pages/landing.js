import { Component } from 'react'
import React from "react";
import Link from "next/link";

import { loginUser, registerUser } from "../services";
import { connect } from "react-redux";

import { withRouter } from "next/router";
import {
  setAuth,
  setExploreType,
  setGender,
  setPeriod,
} from "../redux/actions";

const countriesNames = require('countries-names');
const countries = countriesNames.all().map(x => ({ value: x.name, label: x.name }))

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
            await this.props.router.push("/login")
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
            <div>
                <div className="navbar-start is-flex-direction-column">
                        <Link href={"/login"}>
                            <div className="landing-body">
                                <div style={{height: '40%', display: 'flex', alignItems: 'center'}}>
                                    <div style={{textAlign: 'center'}}>
                                        <h1 className="brand">DRANBS</h1>
                                        <div>inspire your styles</div>
                                    </div>
                                </div>
                                <div style={{height: '60%'}}>
                                    <button className="button is-primary login-btn-d-none" style={{marginTop: '-55px'}} type='submit'>
                                        Login / Sign up
                                    </button>
                                </div>
                            </div>
                        </Link>
                </div>
            </div>
        )
    }
}

export default connect(null, { setAuth })(withRouter(Login))
