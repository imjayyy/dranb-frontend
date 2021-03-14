import React from 'react'
import Default from "../components/layout/Default";
import {submitTicket} from "../services";

class Contact extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            message: '',
            error: null,
            success: null
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

    handleSubmit = async event => {
        event.preventDefault();

        try {
            const data = await submitTicket({
                name: this.state.name,
                email: this.state.email,
                message: this.state.message
            })
            this.setState({
                success: data.message,
                name: '',
                email: '',
                message: '',
                error: null
            })

        } catch (e) {
            this.setState({
                error: e.response.data,
                success: null
            })
        }
    }

    handleDelete = () => {
        this.setState({
            success: null
        })
    }

    render() {
        return (
            <Default>
                <div id="hero-and-body">
                    <section id="page-body">
                        <div className="wrapper">
                            <div className="spacer-big"/>
                            <div className="columns clearfix">
                                <div className="column is-one-quarter">
                                    <h5 className="title-alt"><strong>Write Us</strong></h5>
                                </div>
                                <div className="column is-three-quarters">
                                    {this.state.success && (
                                        <div className="notification is-success">
                                            <button className="delete" onClick={this.handleDelete} />
                                            {this.state.success}
                                        </div>
                                    )}
                                    <form id="contact-form" className="checkform sendemail" method="POST"
                                          onSubmit={this.handleSubmit}>
                                        <div className="field">
                                            <label htmlFor="name" className="label">Name <abbr title="required"
                                                                                               className="required">*</abbr></label>
                                            <input type="text" name="name" id="name" value={this.state.name} required
                                                   onChange={this.handleChange} className="input"/>
                                        </div>
                                        <div className="field">
                                            <label htmlFor="email" className="label">Email <abbr title="required"
                                                                                                 className="required">*</abbr></label>
                                            <input type="email" name="email" value={this.state.email} required
                                                   onChange={this.handleChange} id="email" className="input"/>
                                            {this.state.error && this.state.error.email && (
                                                this.state.error.email.map((message, index) => (
                                                    <p key={index} className="help is-danger">{message}</p>
                                                ))
                                            )}
                                        </div>
                                        <div className="field">
                                            <label htmlFor="message" className="label">Message <abbr title="required"
                                                                                                     className="required">*</abbr></label>
                                            <textarea name="message" id="message" value={this.state.message} required
                                                      onChange={this.handleChange} className="input" rows="15"/>
                                        </div>
                                        <div className="field">
                                            <input type="submit" name="submit" className="button is-primary"
                                                   value="Send Message"/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </Default>
        )
    }
}

export default Contact
