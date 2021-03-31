import {Component} from 'react'
import React from "react";
import Link from "next/link";

import {connect} from "react-redux";

import {withRouter} from "next/router";
import {
    setAuth,
} from "../redux/actions";

class Login extends Component {
    componentDidMount() {
        if (this.props.auth) {
            this.props.router.push('/home')
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
                                <button className="button is-primary login-btn-d-none" style={{marginTop: '-55px'}}
                                        type='submit'>
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

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
    }
}

export default connect(mapStateToProps, {setAuth})(withRouter(Login))
