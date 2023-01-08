import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getAllHandbook } from '../../../services/userService'
import { withRouter } from 'react-router'
import HeaderHomePage from '../../HomePage/HeaderHomePage';
import './ListingHandbook.scss'
class ListingHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandbook: []
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    async componentDidMount() {
        let res = await getAllHandbook()
        if (res && res.errCode === 0) {
            this.setState({
                dataHandbook: res.data ? res.data : []
            })
        }
    }
    handleViewDetailHandbook = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${item.id}`)
        }
    }
    render() {
        let { dataHandbook } = this.state

        return (
            <>
                <HeaderHomePage />
                <div className='listing-container'>
                    <div className='listing-content'>
                        {dataHandbook && dataHandbook.length > 0 && dataHandbook.map((item, index) => {
                            return (
                                <div className="card bg-light mb-3" key={index}
                                    onClick={() => { this.handleViewDetailHandbook(item) }}
                                >
                                    <div className="image" onClick={() => { this.handleViewDetailHandbook(item) }}
                                        style={{ backgroundImage: `url(${item.image})`, width: ' 278px', height: '150px' }}
                                    >
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title" onClick={() => { this.handleViewDetailHandbook(item) }}>{item.name}</h5>
                                        <button className="btn btn-primary"
                                            onClick={() => { this.handleViewDetailHandbook(item) }}>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListingHandbook));
