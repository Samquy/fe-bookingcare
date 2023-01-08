import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserAPI, deleteUserAPI, editUserAPI } from '../../services/userService.js';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';
class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModelUser: false,
            isOpenEditUser: false,
            userEdit: {},
        }
    }
    async componentDidMount() {
        await this.getAllUserFromReact()
    }
    getAllUserFromReact = async () => {
        let res = await getAllUsers('ALL');
        if (res && res.errCode === 0) {
            this.setState({
                arrUsers: res.users
            })
        }
    }
    handleAddNewUser = () => {
        this.setState({
            isOpenModelUser: true
        })
    }
    handleToggle = () => {
        this.setState({
            isOpenModelUser: !this.state.isOpenModelUser
        })
    }
    handleEditUserToggle = () => {
        this.setState({
            isOpenEditUser: !this.state.isOpenEditUser
        })
    }
    createNewUser = async (data) => {
        try {
            let res = await createNewUserAPI(data)
            if (res && res.errCode !== 0) {
                alert(res.errMessage)
            } else {
                this.getAllUserFromReact()
                this.setState({
                    isOpenModelUser: false
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (error) {
            console.log(error)
        }
    }
    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserAPI(user.id)
            if (res && res.errCode === 0) {
                await this.getAllUserFromReact()
            } else {
                alert(res.errMessage)
            }
        } catch (error) {
            console.log(error)
        }
    }
    handleEditUser = async (user) => {
        this.setState({
            isOpenEditUser: true,
            currentUser: user
        })

    }
    excuteEditUser = async (user) => {
        try {
            let res = await editUserAPI(user)
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenEditUser: false
                })
                await this.getAllUserFromReact()
            }
            else {
                alert(res.errMessage)
            }
        } catch (error) {
            console.log(error)
        }
    }
    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className='user-container'>
                <ModalUser
                    isOpen={this.state.isOpenModelUser}
                    handleToggle={this.handleToggle}
                    createNewUser={this.createNewUser}
                />
                {this.state.isOpenEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenEditUser}
                        handleToggle={this.handleEditUserToggle}
                        currentUser={this.state.currentUser}
                        editTheUser={this.excuteEditUser}
                    />}
                <div className="text-center">Manage users abc</div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-3' onClick={() => { this.handleAddNewUser() }}>
                        <i className="fas fa-plus"></i> Add New User
                    </button>
                </div>
                <div className='user-table mt-3 mx-1'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>

                            {arrUsers && arrUsers.map((item, index) => {
                                return (

                                    <tr key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => { this.handleEditUser(item) }} >Edit</button>
                                            <button className='btn-delete' onClick={() => { this.handleDeleteUser(item) }} >Delete</button>
                                        </td>

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>


                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
