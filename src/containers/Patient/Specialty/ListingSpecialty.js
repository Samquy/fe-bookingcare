import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getAllSpecialty } from '../../../services/userService'
import { withRouter } from 'react-router'
import HeaderHomePage from '../../HomePage/HeaderHomePage';
import './ListingSpecialty.scss'
class ListingSpecialty extends Component {
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
    render() {
        let { dataSpecialty } = this.state
        return (
            <>
                <HeaderHomePage />
                <div className='listing-container'>
                    <div className='listing-content'>
                        {dataSpecialty && dataSpecialty.length > 0 && dataSpecialty.map((item, index) => {
                            return (
                                <div className="card bg-light mb-3" key={index}
                                    onClick={() => { this.handleViewDetailSpecialty(item) }}
                                >
                                    <div className="image" onClick={() => { this.handleViewDetailSpecialty(item) }}
                                        style={{ backgroundImage: `url(${item.image})`, width: ' 278px', height: '150px' }}
                                    >
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title" onClick={() => { this.handleViewDetailSpecialty(item) }}>{item.name}</h5>
                                        <button className="btn btn-primary"
                                            onClick={() => { this.handleViewDetailSpecialty(item) }}>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListingSpecialty));
