import React from 'react'
import Profile from "../components/layout/Profile";

class MyFollowing extends React.Component {
    render() {
        return (
            <Profile headTitle="I follow" headIcon="dashboard">
                My following
            </Profile>
        )
    }
}

export default MyFollowing
