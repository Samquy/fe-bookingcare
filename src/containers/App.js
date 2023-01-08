import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';
import { path } from '../utils'
import Home from '../routes/Home';
import Doctor from '../routes/Doctor'
import Login from './Auth/Login';
import System from '../routes/System';
// import { CustomToastCloseButton } from '../components/CustomToast';
import HomePage from './HomePage/HomePage.js'
import CustomScrollbars from '../components/CustomScrollbars';
import DetailDoctor from './Patient/Doctor/DetailDoctor';
import VerifyEmailBooking from './Patient/VerifyEmailBooking';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty';
import DetailClinic from './Patient/Clinic/DetailClinic';
import ListingSpecialty from './Patient/Specialty/ListingSpecialty';
import ListingClinic from './Patient/Clinic/ListingClinic';
import ListingDoctor from './Patient/Doctor/ListingDoctor';
import DetailHandbook from './Patient/Handbook/DetailHandbook';
import ListingHandbook from './Patient/Handbook/ListingHandbook';
import ListingParkage from './Patient/Parkage/ListingParkage';
import ParkageDetail from './Patient/Parkage/ParkageDetail';
import VerifyEmailBookingParkage from './Patient/Parkage/VerifyEmailBookingParkage';
class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">

                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />
                                    <Route path={path.HOMEPAGE} component={(HomePage)} />
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                    <Route path={'/doctor/'} component={userIsAuthenticated(Doctor)} />
                                    <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                                    <Route path={path.DETAIL_SPECIALTY} component={DetailSpecialty} />
                                    <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                                    <Route path={path.VERIFY_EMAIL_BOOKING} component={VerifyEmailBooking} />
                                    <Route path={path.LISTING_SPECIALTY} component={ListingSpecialty} />
                                    <Route path={path.LISTING_CLINIC} component={ListingClinic} />
                                    <Route path={path.LISTING_DOCTOR} component={ListingDoctor} />
                                    <Route path={path.DETAIL_HANDBOOK} component={DetailHandbook} />
                                    <Route path={path.LISTING_HANDBOOK} component={ListingHandbook} />
                                    <Route path={path.LISTING_PARKAGE} component={ListingParkage} />
                                    <Route path={path.DETAIL_PARKAGE} component={ParkageDetail} />
                                    <Route path={path.VERIFY_EMAIL_BOOKING_PARKAGE} component={VerifyEmailBookingParkage} />


                                </Switch>
                            </CustomScrollbars>
                        </div>

                        {/* <ToastContainer
                            className="toast-container" toastClassName="toast-item" bodyClassName="toast-item-body"
                            autoClose={false} hideProgressBar={true} pauseOnHover={false}
                            pauseOnFocusLoss={true} closeOnClick={false} draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        /> */}
                        <ToastContainer
                            position='bottom-right'
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </Fragment >
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);