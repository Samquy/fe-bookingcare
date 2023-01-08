import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../HomePage.scss';


class About extends Component {

    render() {

        return (
            <div className='section section-about'>

                <div className='section-about-header'>
                    Truyền Thông Nói Về Booking Care
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="530" height="320"
                            src="https://www.youtube.com/embed/jh5U5BnpGN8"
                            title="The Future of Healthcare" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>

                        </iframe>
                    </div>
                    <div className='content-right'>

                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
