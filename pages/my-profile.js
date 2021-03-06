import {Component} from 'react'
import Layout from '../components/layout'
import React from "react";
import {Radio} from 'pretty-checkbox-react';

const countriesNames = require('countries-names');
import Select from 'react-select';

const countries = countriesNames.all().map(x => ({value: x.name, label: x.name}))
import {getUser, patchProfile} from "../services";


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
            error: '',
            message: ''
        }
    }

    componentDidMount() {
        getUser().then(data => {
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
        })
    }

    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value,
            message: ''
        })
    }

    updateProfile = async (event) => {
        event && event.preventDefault()
        this.setState({error: ''})

        try {
            await patchProfile({
                user: {
                    first_name: this.state.firstName,
                    last_name: this.state.lastName,
                    gender: parseInt(this.state.gender),
                    birthday: `${this.state.birthdayYYYY}-${this.state.birthdayMM}-${this.state.birthdayDD}`,
                    country: this.state.country.value,
                    email: this.state.email,
                    username: this.state.username,
                    password: this.state.password,
                    password_confirm: this.state.passwordAgain
                }
            }, this.props.token)
            this.setState({
                message: 'Success !'
            })
        } catch (error) {
            console.error(
                'You have an error in your code or there are Network issues.',
                error
            )
            this.setState({error: error.message})
        }
    }

    render() {
        return (
            <Layout>
                <div className="container">
                    <div id="page-content">
                        <div id="hero-and-body">
                            <div id="page-body">
                                <div className="columns is-multiline is-mobile mt-5">
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
                                            </div>
                                            <div className="field">
                                                <label className="label">Gender</label>
                                                <>
                                                    <Radio onChange={e => this.setState({gender: "1"})}
                                                           checked={this.state.gender === "1"}
                                                           name="1">Women</Radio>
                                                    <Radio onChange={e => this.setState({gender: "2"})}
                                                           checked={this.state.gender === "2"}
                                                           name="2">Men</Radio>
                                                </>
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
                                            </div>

                                            <div className="field">
                                                <button className="button is-primary" type='submit'>
                                                    Update
                                                </button>
                                            </div>
                                            <div className="field">
                                                <p className={`error ${this.state.error && 'show'}`}>
                                                    {this.state.error && `Error: ${this.state.error}`}
                                                </p>

                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default withAuthSync(MyProfile)
