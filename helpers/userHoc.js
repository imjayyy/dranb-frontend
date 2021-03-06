import React from 'react'
import {useStore, store} from "../hooks/currentUser";

function withLanguages(Component)  {
    const WithLanguages = props => <Component {...props} />

    const [user] = useStore();
    WithLanguages.getInitialProps = async context => {
        return {
            ...(Component.getInitialProps ? await Component.getInitialProps(context) : {})

        }
    }

    // WithLanguages.user = 123

    return WithLanguages
}

export default withLanguages
