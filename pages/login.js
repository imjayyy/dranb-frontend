import { Component } from 'react'
import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { withRouter } from "next/router";
import { loginUser } from "../services";
import { setAuth } from "../redux/actions";
import Default from "../components/layout/Default";

import styles from '../styles/Login.module.scss'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: null,
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
        const email = this.state.email
        const password = this.state.password

        try {
            const response = await loginUser({
                email: email,
                password: password
            })
            this.setState({
                error: null,
            })
            this.props.setAuth(response.data)
            await this.props.router.push("/home")
        } catch (error) {
            this.setState({
                error: error.response.data
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
                                <div className="is-flex is-justify-content-center">
                                    <div className={styles.login}>
                                        <h4 className={styles.title}>Welcome to DRANBS</h4>
                                        <p className={styles.subTitle}>Sign in to continue</p>
                                        <form onSubmit={this.handleLogin}>
                                            {this.state.error && this.state.error.non_field_errors && (
                                                this.state.error.non_field_errors.map((message, index) => (
                                                    <div className="notification is-danger" key={index}>
                                                        {message}
                                                    </div>
                                                ))
                                            )}
                                            <div className={`field ${styles.input}`}>
                                                <div className="control has-icons-left">
                                                    <input
                                                        type="email"
                                                        className="input"
                                                        placeholder="Your Email"
                                                        value={this.state.email}
                                                        onChange={e => this.setState({ email: e.target.value })}
                                                    />
                                                    <span className="icon is-small is-left"><i className="fal fa-envelope" /></span>
                                                </div>
                                                {this.state.error && this.state.error.email && (
                                                    this.state.error.email.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className={`field ${styles.input}`}>
                                                <div className="control has-icons-left">
                                                    <input
                                                        type="password"
                                                        className="input"
                                                        placeholder="Password"
                                                        value={this.state.password}
                                                        onChange={e => this.setState({ password: e.target.value })}
                                                    />
                                                    <span className="icon is-small is-left"><i className="fal fa-lock-alt" /></span>
                                                </div>
                                                {this.state.error && this.state.error.password && (
                                                    this.state.error.password.map((message, index) => (
                                                        <p className="help is-danger" key={index}>
                                                            {message}
                                                        </p>
                                                    ))
                                                )}
                                            </div>
                                            <div className={`field ${styles.button}`}>
                                                <button className="button is-black is-block is-fullwidth">Sign In</button>
                                            </div>
                                        </form>
                                        <div className={styles.divider}>
                                            <p>OR</p>
                                        </div>
                                        <div className={`field ${styles.socialButton}`}>
                                            <button className="button is-block is-fullwidth">
                                                <span className="icon"><img src="/icons/Google.svg"/></span> Login with Google
                                            </button>
                                        </div>
                                        <div className={`field ${styles.socialButton}`}>
                                            <button className="button is-block is-fullwidth">
                                                <span className="icon"><img src="/icons/Facebook.svg"/></span> Login with facebook
                                            </button>
                                        </div>
                                        <div className="field has-text-centered">
                                            <Link href="/forgot-password">
                                                <a className={styles.link}>Forgot Password?</a>
                                            </Link>
                                        </div>
                                        <div className="field has-text-centered">
                                            <p className={styles.hint}>Don't have an account? <Link href="/register"><a className={styles.link}>Register</a></Link></p>
                                        </div>
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
