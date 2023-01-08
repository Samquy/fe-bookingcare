import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import Header from '../containers/Header/Header';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManagePatientAdmin from '../containers/System/Admin/ManagePatientAdmin';
import ManageHandbook from '../containers/System/Handbook/ManageHandbook';
import ManageParkage from '../containers/System/Parkage/ManageParkage';
import ManagePatientForParkage from '../containers/System/Parkage/ManagePatientForParkage';
class System extends Component {
    render() {

        const { systemMenuPath } = this.props;
        // const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <>
                {this.props.isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/user-manage" component={UserManage} />
                            <Route path="/system/user-redux" component={UserRedux} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />
                            <Route path="/system/manage-specialty" component={ManageSpecialty} />
                            <Route path="/system/manage-clinic" component={ManageClinic} />
                            <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                            <Route path="/system/manage-patient-admin" component={ManagePatientAdmin} />
                            <Route path="/system/manage-patient-parkage" component={ManagePatientForParkage} />
                            <Route path="/system/manage-handbook-admin" component={ManageHandbook} />
                            <Route path="/system/manage-parkage-admin" component={ManageParkage} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
