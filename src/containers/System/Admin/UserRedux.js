import React, { Component } from 'react';
import * as actions from "../../../store/actions";
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LANGUAGE, CRUD_ACTIONS, } from '../../../utils/constant';
import { CommonUtils } from '../../../utils'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import './UserRedux.scss'
import TableManageUser from './TableManageUser';

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: '',
            isOpen: false,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phonenumber: '',
            gender: '',
            role: '',
            position: '',
            avatar: '',
            action: '',
            userEditId: '',
        }
    }
    async componentDidMount() {
        this.props.getGenderStart()
        this.props.getPositionStart()
        this.props.getRoleStart()

        // this.props.dispatch(actions.FetchGenderStart())
        // try {
        //     let res = await getallcodeServive('GENDER')
        //     if (res && res.errCode === 0) {
        //         this.setState({
        //             genderArr: res.data
        //         })
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux
            let arrPositions = this.props.positions
            let arrRoles = this.props.role
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phonenumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImgUrl: ''

            })
        }
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
        // if (prevProps.positions !== this.props.positions) {
        //     this.setState({
        //         positionArr: this.props.positions
        //     })
        // }
        if (prevProps.positions !== this.props.positions) {
            let arrPositions = this.props.positions
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }
        if (prevProps.role !== this.props.role) {
            let arrRoles = this.props.role
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })
        }

    }
    handleChangeImg = async (event) => {
        let data = event.target.files;
        let file = data[0]
        let base64 = await CommonUtils.getBase64(file)
        if (file) {
            let objectUrl = URL.createObjectURL(file)
            this.setState({
                previewImgUrl: objectUrl,
                avatar: base64
            })
        }
    }
    openPreviewImage = () => {
        if (!this.state.previewImgUrl) return;
        this.setState({
            isOpen: true
        })
    }
    handleSaveUser = () => {
        let isValid = this.checkValidateInput()
        let { action } = this.state
        if (isValid) {
            if (action === CRUD_ACTIONS.CREATE) {
                this.props.createNewUser({
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    address: this.state.address,
                    phonenumber: this.state.phonenumber,
                    gender: this.state.gender,
                    roleid: this.state.role,
                    positionId: this.state.position,
                    avatar: this.state.avatar
                })
            }
            if (action === CRUD_ACTIONS.EDIT) {
                this.props.editAUserRedux({
                    id: this.state.userEditId,
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    address: this.state.address,
                    phonenumber: this.state.phonenumber,
                    gender: this.state.gender,
                    roleid: this.state.role,
                    positionId: this.state.position,
                    avatar: this.state.avatar
                })
            }
        }
    }
    checkValidateInput = () => {
        let isValid = true
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'phonenumber', 'address']
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false
                alert('Missing Parameter ' + arrInput[i])
                break;
            }
        }
        return isValid;
    }
    onChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }
    handleEditUserFromParent = (user) => {
        let imageBase64 = ''
        if (user.image) {
            imageBase64 = Buffer.from(user.image, 'base64').toString('binary')
        }
        this.setState({
            userEditId: user.id,
            email: user.email,
            password: 'HASHCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phonenumber: user.phonenumber,
            gender: user.gender,
            role: user.roleid,
            position: user.positionId,
            action: CRUD_ACTIONS.EDIT,
            avatar: '',
            previewImgUrl: imageBase64,
        })
    }
    render() {
        let gender = this.state.genderArr
        let position = this.state.positionArr
        let role = this.state.roleArr
        let language = this.props.language
        let isloadingGender = this.props.isloadingGender

        return (
            <div className='user-redux-container'>
                <div className='title'>User Redux CRUD</div>
                <div>{isloadingGender === true ? "Loading" : ''}</div>
                <div className="text-body" >
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-4 font-weight-bold'>
                                <FormattedMessage id="manage-user.add" />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.email" /></label>
                                <input className='form-control' type='email'
                                    value={this.state.email}
                                    name='email'
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                    onChange={(event) => { this.onChangeInput(event, 'email') }}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input className='form-control' type='password'
                                    value={this.state.password}
                                    name='password'
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                    onChange={(event) => { this.onChangeInput(event, 'password') }} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.firstName" /></label>
                                <input className='form-control' type='text'
                                    value={this.state.firstName}
                                    name='firstName'
                                    onChange={(event) => { this.onChangeInput(event, 'firstName') }} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.lastName" /></label>
                                <input className='form-control' type='text'
                                    value={this.state.lastName}
                                    name='lastName'
                                    onChange={(event) => { this.onChangeInput(event, 'lastName') }} />
                            </div>
                            < div className='col-3'>
                                <label><FormattedMessage id="manage-user.phonenumber" /></label>
                                <input className='form-control' type='text'
                                    value={this.state.phonenumber}
                                    name='phonenumber'
                                    onChange={(event) => { this.onChangeInput(event, 'phonenumber') }} />
                            </div>
                            < div className='col-9'>
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input className='form-control' type='text'
                                    value={this.state.address}
                                    name='address'
                                    onChange={(event) => { this.onChangeInput(event, 'address') }} />
                            </div>
                            < div className='col-3 form-group'>
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select className="form-control" value={this.state.gender} onChange={(event) => { this.onChangeInput(event, 'gender') }}>
                                    {gender && gender.length > 0 && gender.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === LANGUAGE.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            < div className='col-3'>
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select className="form-control" value={this.state.position} onChange={(event) => { this.onChangeInput(event, 'position') }} >
                                    {position && position.length > 0 && position.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === LANGUAGE.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            < div className='col-3'>
                                <label><FormattedMessage id="manage-user.roleid" /></label>
                                <select className="form-control" value={this.state.role} onChange={(event) => { this.onChangeInput(event, 'role') }}>
                                    {role && role.length > 0 && role.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === LANGUAGE.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            < div className='col-3'>
                                <label><FormattedMessage id="manage-user.image" /></label>
                                <div className='preview-image-container'>
                                    <input className='form-control' id='previewImg' type='file' hidden
                                        onChange={(event) => { this.handleChangeImg(event) }}
                                    />
                                    <label className='label-upload' htmlFor='previewImg'>Tải Ảnh <i className='fas fa-upload'></i></label>
                                    <div className='preview-image'
                                        style={{ backgroundImage: `url(${this.state.previewImgUrl})` }}
                                        onClick={() => { this.openPreviewImage() }}
                                    >
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 my-3 ' >
                                <button className='btn btn-primary' onClick={() => { this.handleSaveUser() }}>
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id='manage-user.edit' />
                                        : <FormattedMessage id='manage-user.save' />}
                                </button>
                            </div>
                            <div className='col-12 mb-5'>
                                <TableManageUser
                                    handleEditUserFromParent={this.handleEditUserFromParent} />
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        )
    }

}
const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isloadingGender: state.admin.isloadingGender,
        positions: state.admin.positions,
        role: state.admin.role,
        listUsers: state.admin.users,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.FetchGenderStart()),
        getPositionStart: () => dispatch(actions.FetchPositionStart()),
        getRoleStart: () => dispatch(actions.FetchRoleStart()),
        changeLanguageAppRedux: (languageData) => dispatch(actions.changeLanguageApp(languageData)),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editAUserRedux: (data) => dispatch(actions.editAUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
