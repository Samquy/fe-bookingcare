import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { LANGUAGE } from '../../../utils';
import '../HomePage.scss';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { getAllHandbook } from '../../../services/userService'


class Handbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrHandbook: []
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    componentDidMount() {
        this.GetAllHandbook()
    }
    GetAllHandbook = async () => {
        let res = await getAllHandbook()
        if (res && res.errCode === 0) {
            this.setState({
                arrHandbook: res.data
            })
        }
    }
    handleViewDetailHandbook = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${item.id}`)
        }
    }
    directToHandbook = () => {
        if (this.props.history) {
            this.props.history.push(`/listing-handbook`)
        }
    }
    render() {
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 1
        };
        let { arrHandbook } = this.state
        return (
            <div className='section section-handbook'>
                <div className='section-content'>
                    <div className='slider-header'>
                        <span className='title-section'>
                            <FormattedMessage id='homepage.handbook' />
                        </span>
                        <button className='btn-section' onClick={() => { this.directToHandbook() }}>
                            <FormattedMessage id='homepage.more-info' />
                        </button>
                    </div>
                    <div className='slider-content'>
                        <Slider {...settings}>
                            {arrHandbook && arrHandbook.length > 0 && arrHandbook.map((item, index) => {
                                return (
                                    <div className='section-customize ' key={index} onClick={() => { this.handleViewDetailHandbook(item) }}>
                                        <div className='handbook-container'>
                                            <div className='img-contain'>
                                                <div className='bg-img img-handbook'
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                >
                                                </div>
                                            </div>
                                            <div className='position-handbook'>
                                                <span >{item.name}</span>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Handbook));
