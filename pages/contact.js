import React from 'react'
import Layout from "../components/layout";

class Contact extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            message: ''
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

    render() {
        return (
            <Layout>
                <div id="hero-and-body">

                    <section id="page-body">

                        <div className="wrapper">


                            <div className="spacer-big"/>

                            <div className="columns clearfix">
                                <div className="column is-one-quarter">
                                    <h5 className="title-alt"><strong>Write Us</strong></h5>
                                </div>

                                <div className="column is-three-quarters">
                                    <form id="contact-form" className="checkform sendemail"
                                          action="https://formcarry.com/s/3LLn3oWAwnH" method="POST">

                                        <div className="field">
                                            <label htmlFor="name" className="label">Name <abbr title="required"
                                                                             className="required">*</abbr></label>
                                            <input type="text" name="name" id="name" value={this.state.name}
                                                   onChange={this.handleChange} className="input"/>
                                        </div>

                                        <div className="field">
                                            <label htmlFor="email" className="label">Email <abbr title="required"
                                                                               className="required">*</abbr></label>
                                            <input type="text" name="email" value={this.state.email}
                                                   onChange={this.handleChange} id="email" className="input"/>
                                        </div>

                                        <div className="field">
                                            <label htmlFor="message" className="label">Message <abbr title="required"
                                                                                   className="required">*</abbr></label>
                                            <textarea name="message" id="message" value={this.state.message}
                                                      onChange={this.handleChange} className="input" rows="15"/>
                                        </div>

                                        <div className="form-row form-note">
                                            <div className="alert-error">
                                                <p>Please check your entries!</p>
                                            </div>
                                        </div>

                                        {/*<div className="form-row hidden">*/}
                                        {/*    <input type="text" id="form-check" name="form-check" value=""*/}
                                        {/*           className="form-check"/>*/}
                                        {/*</div>*/}

                                        <div className="field">
                                            <input type="submit" name="submit" className="button is-primary" value="Send Message"/>
                                        </div>

                                        <input type="hidden" readOnly={true} name="subject" value="Stylaray contact"/>
                                        <input type="hidden" readOnly={true} name="fields" value="name,email,message"/>
                                    </form>
                                </div>
                            </div>

                        </div>


                    </section>

                </div>

            </Layout>
        )
    }
}

export default Contact
