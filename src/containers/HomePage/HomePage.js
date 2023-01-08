import React, { Component } from 'react';
import { connect } from 'react-redux';
import HeaderHomePage from './HeaderHomePage';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/Medical-Facility';
import OutstaindingDoctor from './Section/Outstainding-doctor';
import Handbook from './Section/Handbook';
import About from './Section/about'
import FooterHomePage from './FooterHomePage';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css';
class HomePage extends Component {

    render() {
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1
        };
        return (

            <div>
                <HeaderHomePage isShowBanner={true} />
                <Specialty
                    settings={settings}
                />
                <MedicalFacility
                    settings={settings}
                />
                <OutstaindingDoctor
                    settings={settings}
                />
                <Handbook
                    settings={settings}
                />
                <About />
                <FooterHomePage />
            </div>
        )

    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
