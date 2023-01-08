import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../HomePage.scss';
import Slider from 'react-slick';
import { withRouter } from 'react-router'
import { getAllClinic } from '../../../services/userService'
import { FormattedMessage } from 'react-intl';

class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinic: []
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    async componentDidMount() {
        let res = await getAllClinic()
        if (res && res.errCode === 0) {
            this.setState({
                dataClinic: res.data ? res.data : []
            })
        }
    }
    handleViewDetailClinic = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${item.id}`)
        }
    }
    directToClinic = () => {
        if (this.props.history) {
            this.props.history.push(`/listing-clinic`)
        }
    }
    render() {
        let { dataClinic } = this.state
        return (
            <div className='section section-medical-facility'>
                <div className='section-content'>
                    <div className='slider-header'>
                        <span className='title-section'> <FormattedMessage id='headerhomepage.health-facility' /></span>
                        <button className='btn-section' onClick={() => { this.directToClinic() }}>
                            <FormattedMessage id='homepage.more-info' /></button>
                    </div>
                    <div className='slider-content'>
                        <Slider {...this.props.settings}>
                            {dataClinic && dataClinic.length > 0 && dataClinic.map((item, index) => {
                                return (
                                    <div className='section-customize' key={index}
                                        onClick={() => { this.handleViewDetailClinic(item) }}
                                    >
                                        <div className='bg-img img-medical-facility'
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        ></div>
                                        <div className='position text-center'>{item.name}</div>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
