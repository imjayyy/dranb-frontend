import {Component} from 'react'
import React from "react";
import Select from 'react-select';
import DatePicker from 'react-datepicker'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {registerUser} from "../services";
import {setAuth} from "../redux/actions";
import Default from "../components/layout/Default";

import "react-datepicker/dist/react-datepicker.css";
import styles from '../styles/Register.module.scss'

const countriesNames = require('countries-names');
const countries = countriesNames.all().map(x => ({value: x.name, label: x.name}))

const genders = [
    {value: 2, label: 'Male'},
    {value: 1, label: 'Female'},
    {value: 0, label: 'Other'}
]

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            gender: 1,
            birthDay: new Date(),
            country: '',
            email: '',
            username: '',
            password: '',
            passwordConfirm: '',
            error: null
        }
    }

    validator = () => {
        return Object.keys(this.state)
            .filter(x => x.startsWith("register"))
            .find(x => this.state[x].length === 0)
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
        this.setState({error: ''})

        try {
            let payload = {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                gender: parseInt(this.state.gender),
                country: this.state.country.value,
                email: this.state.email,
                username: this.state.username,
                password: this.state.password,
                password_confirm: this.state.passwordConfirm,
                birthday: this.state.birthDay
            }
            let response = await registerUser(payload)
            this.props.setAuth(response.data)
            await this.props.router.push("/home")
        } catch (error) {
            this.setState({
                registerError: error.response.data
            })
        }
    }

    render() {
        return (
            <Default>
                <div className="container">
                    <div className="is-flex is-justify-content-center">
                        <div className={styles.register}>
                            <h4 className={styles.heading}>You forgot your password</h4>
                            <p className={styles.subTitle}>enter your email</p>
                            <form onSubmit={this.handleRegister}>
                                <div className="field">
                                    <div className="control has-icons-left">
                                        <input
                                            type="text"
                                            className="input"
                                            value={this.state.firstName}
                                            name="firstName"
                                            placeholder={"First Name"}
                                            required
                                            onChange={this.handleChange}
                                        />
                                        <span className="icon is-small is-left"><i className="fal fa-user" /></span>
                                    </div>
                                    {this.state.error && this.state.error.first_name && (
                                        this.state.error.first_name.map((message, index) => (
                                            <p className="help is-danger" key={index}>
                                                {message}
                                            </p>
                                        ))
                                    )}
                                </div>
                                <div className="field">
                                    <div className="control has-icons-left">
                                        <input
                                            type="text"
                                            className="input"
                                            name="lastName"
                                            value={this.state.lastName}
                                            placeholder={"Last Name"}
                                            required
                                            onChange={this.handleChange}
                                        />
                                        <span className="icon is-small is-left"><i className="fal fa-user" /></span>
                                    </div>
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
                                    <div className="control">
                                        <Select options={genders} onChange={e => this.setState({gender: e})} instanceId="gender" />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Birthday</label>
                                    <div className="control">
                                        <DatePicker className="input" selected={this.state.birthDay} onChange={date => this.setState({birthDay: date})} />
                                    </div>
                                </div>
                                <div className="field">
                                    <input
                                        type="email"
                                        className="input"
                                        name="email"
                                        value={this.state.email}
                                        placeholder={"Email"}
                                        onChange={this.handleChange}
                                        required
                                    />
                                    {this.state.error && this.state.error.email && (
                                        this.state.error.email.map((message, index) => (
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
                                        name="password"
                                        value={this.state.password}
                                        placeholder={"Password"}
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
                                        className="input"
                                        type="password"
                                        name="passwordConfirm"
                                        value={this.state.passwordConfirm}
                                        placeholder={"Password Confirmation"}
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
                                <div className="signup field">
                                    <button className="button is-primary">Sign Up</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Default>
        )
    }
}

export default connect(null, {setAuth})(withRouter(Register))
