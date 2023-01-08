import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomePage.scss';

class HomeFooter extends Component {

    render() {

        return (
            <div className='home-footer'>
                <h5>The copyright ABCDEF &copy;</h5>
            </div>
        )

    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
