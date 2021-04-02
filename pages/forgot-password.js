import React from 'react'
import { withRouter } from "next/router";
import Default from "../components/layout/Default";

import styles from '../styles/ResetPassword.module.scss'

class ForgotPassword extends React.Component {
    render() {
        return (
            <Default>
                <div className="container">
                    <div className="is-flex is-justify-content-center" style={{paddingTop: '92px'}}>
                        <div className={styles.resetPassword}>
                            <h4 className={styles.heading}>You forgot your password</h4>
                            <p className={styles.subTitle}>enter your email</p>
                            <form>
                                <div className={`field ${styles.input}`}>
                                    <div className="control has-icons-left">
                                        <input type="email" className="input" placeholder="Your Email" name="email" />
                                        <span className="icon is-small is-left"><i className="fal fa-envelope" /></span>
                                    </div>
                                </div>
                                <div className={`field ${styles.button}`}>
                                    <button className="button is-black is-block is-fullwidth">Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Default>
        )
    }
}

export default withRouter(ForgotPassword)