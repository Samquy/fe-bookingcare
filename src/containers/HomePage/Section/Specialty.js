import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../HomePage.scss';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import { getAllSpecialty } from '../../../services/userService'
import { withRouter } from 'react-router'


class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: []
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    async componentDidMount() {
        let res = await getAllSpecialty()
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        }
    }
    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`)
        }
    }
    directToSpecialty = () => {
        if (this.props.history) {
            this.props.history.push(`/Listing-specialty`)
        }
    }
    render() {
        let { dataSpecialty } = this.state
        return (
            <div className='section section-specialty'>
                <div className='section-content'>
                    <div className='slider-header'>
                        <span className='title-section'>
                            <FormattedMessage id='homepage.specialty-popular' />
                        </span>
                        <button className='btn-section' onClick={() => { this.directToSpecialty() }}
                        ><FormattedMessage id='homepage.more-info' /></button>
                    </div>
                    <div className='slider-content'>
                        <Slider {...this.props.settings}>
                            {dataSpecialty && dataSpecialty.length > 0 && dataSpecialty.map((item, index) => {
                                return (
                                    <div className='section-customize ' key={index}
                                        onClick={() => { this.handleViewDetailSpecialty(item) }}
                                    >
                                        <div className='bg-img img-specialty'
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        >

                                        </div>
                                        <div className='specialty-name position text-center'>{item.name}</div>
                                    </div>
                                )
                            })}

                        </Slider>
                    </div>

                </div>
            </div>
        )

    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
