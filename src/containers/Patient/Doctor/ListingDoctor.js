import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { getAllDoctors } from '../../../services/userService'
import './ListingDoctor.scss'
import HeaderHomePage from '../../HomePage/HeaderHomePage';
import { FormattedMessage } from 'react-intl';
import * as actions from "../../../store/actions";


class ListingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDoctor: []
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorRedux !== this.props.topDoctorRedux) {
            this.setState({
                dataDoctor: this.props.topDoctorRedux
            })
        }
    }
    async componentDidMount() {
        // let res = await getAllDoctors()
        // if (res && res.errCode === 0) {
        //     this.setState({
        //         dataDoctor: res.data ? res.data : []
        //     })
        // }
        this.props.fetchTopDoctor()
    }
    handleViewDetailDoctor = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${item.id}`)
        }
    }
    render() {
        let { dataDoctor } = this.state
        let { language } = this.props
        return (
            <>
                <HeaderHomePage />
                <div className='listing-container-dr'>
                    <div className='listing-content'>
                        {dataDoctor && dataDoctor.length > 0 && dataDoctor.map((item, index) => {
                            let imageBase64 = ''
                            if (item.image) {
                                imageBase64 = Buffer.from(item.image, 'base64').toString('binary')
                            }
                            return (
                                <div className="card bg-light mb-3" key={index}
                                    onClick={() => { this.handleViewDetailDoctor(item) }}
                                >
                                    <div className="image-dr"
                                        style={{ backgroundImage: `url(${imageBase64})` }}
                                    >
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title" onClick={() => { this.handleViewDetailDoctor(item) }}><FormattedMessage id='headerhomepage.doctor' /></h5>
                                        <p className="card-text">{item.firstName} {item.lastName}</p>
                                        <button className="btn btn-primary"
                                            onClick={() => { this.handleViewDetailDoctor(item) }}>
                                            <FormattedMessage id='homepage.select' />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListingDoctor));
