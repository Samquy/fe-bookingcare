import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { getAllClinic } from '../../../services/userService'
import './ListingClinic.scss'
import HeaderHomePage from '../../HomePage/HeaderHomePage';
import { FormattedMessage } from 'react-intl';


class ListingClinic extends Component {
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
    render() {
        let { dataClinic } = this.state
        return (
            <>
                <HeaderHomePage />
                <div className='listing-container'>
                    <div className='listing-content'>
                        {dataClinic && dataClinic.length > 0 && dataClinic.map((item, index) => {
                            return (
                                <div className="card bg-light mb-3" key={index}
                                    onClick={() => { this.handleViewDetailClinic(item) }}
                                >
                                    <div className="image"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    ></div>
                                    <div className="card-body">
                                        <h5 className="card-title" onClick={() => { this.handleViewDetailClinic(item) }}>{item.name}</h5>
                                        <button className="btn btn-primary"
                                            onClick={() => { this.handleViewDetailClinic(item) }}>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListingClinic));
