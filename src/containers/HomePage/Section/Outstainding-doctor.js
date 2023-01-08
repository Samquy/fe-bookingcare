import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE } from '../../../utils';
import '../HomePage.scss';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';


class OutstandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctor: []
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorRedux !== this.props.topDoctorRedux) {
            this.setState({
                arrDoctor: this.props.topDoctorRedux
            })
        }
    }
    componentDidMount() {
        this.props.fetchTopDoctor()
    }
    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }
    }
    directToDoctor = () => {
        if (this.props.history) {
            this.props.history.push(`/listing-doctor`)
        }
    }
    render() {
        let arrDoctor = this.state.arrDoctor
        let { language } = this.props
        console.log('doctor', arrDoctor);
        return (
            <div className='section section-outstanding-doctor'>
                <div className='section-content'>
                    <div className='slider-header'>
                        <span className='title-section'>
                            <FormattedMessage id='homepage.outstanding-doctor' />
                        </span>
                        <button className='btn-section' onClick={() => { this.directToDoctor() }}>
                            <FormattedMessage id='homepage.more-info' />
                        </button>
                    </div>
                    <div className='slider-content'>
                        <Slider {...this.props.settings}>
                            {arrDoctor && arrDoctor.length > 0 && arrDoctor.map((item, index) => {
                                let imageBase64 = ''
                                if (item.image) {
                                    imageBase64 = Buffer.from(item.image, 'base64').toString('binary')
                                }
                                let nameVi = `${item.positionData.valueVi} ${item.firstName} ${item.lastName}`
                                let nameEn = `${item.positionData.valueEn} ${item.lastName} ${item.firstName}`
                                return (
                                    <div className='section-customize' key={index} onClick={() => { this.handleViewDetailDoctor(item) }} >
                                        <div className='border-custom'>
                                            <div className='img-contain'>
                                                <div className='bg-img img-outstandingdoctor'
                                                    style={{ backgroundImage: `url(${imageBase64})` }}
                                                >
                                                </div>
                                            </div>
                                            <div className='position text-center'>
                                                <div>{language === LANGUAGE.VI ? nameVi : nameEn}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            }
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
        topDoctorRedux: state.admin.dataDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchTopDoctor: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor));
