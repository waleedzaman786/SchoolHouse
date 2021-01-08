import React, { Component } from 'react';
import { Form, Container, Button } from 'semantic-ui-react';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import { connect } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
//api
import { updateClass, adminClassCreate, viewAllTeachersClassList } from '../../../ApiAction/Admin';
//Constants 
import { constants } from '../../';
//loader
import { Loaders } from '../../Shared'
class EditClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginUserInfo: props.loginUserInfo,
            editClassModal: {
                id: '',
                class_name: '',
                class_age: "",
                room: "",
                location: "",
                teachers: []
                // students: []
            },
            teachers: [],
            allStudentsList: [],
            students: [],
            teachersObj: {
            },
            isFormLoading: true,
            validationMessage: '',
            isFieldBlank: false,
            first_teacher_id: '',
            second_teacher_id: '',
            third_teacher_id: '',
            first_teacher_name: '',
            second_teacher_name: '',
            third_teacher_name: '',
            allTeachersList: [],
            // selectedStudentsList: [],
            modalType: '',
            modalView: false,
            modalContent: '',
            modalHeading: '',
            apiStatusCode: '',
            teacher1AlertMessage: '',
            teacher2AlertMessage: '',
            teacher3AlertMessage: '',
            foods:[
                { text: 'Student 1', id: 1 },
                { text: 'Student 2', id: 2 },
                { text: 'Student 3', id: 3 },
                { text: 'Student 4', id: 4 }],
        }
        this.editClassValidation = new SimpleReactValidator()
    }

    componentWillMount() {

        if(this.props.loginUserInfo.role_id === 2){
            if (this.props.location.state === undefined) {
                // this.getAllStudentsList()
                this.getAllTeacherList()
            }
            else {
                let { editClassModal } = this.state, { classInfo } = this.props.location.state;    
                editClassModal.id = classInfo.id
                editClassModal.class_age = classInfo.class_age
                editClassModal.class_name = classInfo.class_name
                editClassModal.room = classInfo.room
                editClassModal.location = classInfo.location
                editClassModal.teachers = classInfo.teachers
                //editClassModal.students = classInfo.students
    
                for (let k = 0; k < classInfo.teachers.length; k++) {
                    if (k === 0) {
                        this.setState({ first_teacher_name: classInfo.teachers[k].teacher_id })
                    }
                    if (k === 1) {
                        this.setState({ second_teacher_name: classInfo.teachers[k].teacher_id })
                    }
                    if (k === 2) {
                        this.setState({ third_teacher_name: classInfo.teachers[k].teacher_id })
                    }
                }
    
                this.setState({
                    editClassModal
                }, () => {
                    this.getAllTeacherList()
                })
            }
        }else{
                this.props.history.push('/home')
            }
      
    }

    //showing loader
    showLoader = () => {
        this.setState({
            isFormLoading: true,
            isFieldBlank: false

        }, () => {
            if (this.state.editClassModal.id === '') {
                this.addClass()
            } else {
                this.updateClass()
            }
        })
    }

    // retreiveing all teachers list and showing assigned teachers in dropdown

    getAllTeacherList = () => {
        viewAllTeachersClassList().then(res => {
            // check if component is used in addclass
            if (this.props.location.pathname === "/classes/add") {
                this.setState({
                    allTeachersList: res.data,
                    first_teacher_name: '',
                    second_teacher_name: '',
                    third_teacher_name: '',
                    isFormLoading: false
                })

            } else {
                this.setState({
                    allTeachersList: res.data,
                    isFormLoading: false
                })
            }

        }).catch(err => {
            this.setState({
                apiStatusCode: err ? err.status : 500,
                isFormLoading: false
            }, () => {
                if (this.state.apiStatusCode === 401) {
                    this.props.customProps._toastMessage('error', constants.SESSION_EXPIRED)
                    this.props._removeToken()
                } else if (this.state.apiStatusCode === 500) {
                    this.props.customProps._toastMessage('error', constants.SOMETHING_WENT_WRONG)
                }
                else {
                    this.props.customProps._toastMessage('error', err.message)
                }
            })
        })
    }


    // getAllStudentsList = () => {
    //     console.log('Student Data 1',)
    //     viewAllStudents().then(res => {
    //         // check if component is used in addclass
    //         console.log('Student Data ', res)
    //         if (this.props.location.pathname === "/classes/add") {
    //             this.setState({
    //                 allStudentsList: res.data,
    //                 isFormLoading: false
    //             })

    //         } else {
    //             this.setState({
    //                 allStudentsList: res.data,
    //                 isFormLoading: false
    //             })
    //         }

    //     }).catch(err => {
    //         this.setState({
    //             apiStatusCode: err ? err.status : 500,
    //             isFormLoading: false
    //         }, () => {
    //             if (this.state.apiStatusCode === 401) {
    //                 this.props.customProps._toastMessage('error', constants.SESSION_EXPIRED)
    //                 this.props._removeToken()
    //             } else if (this.state.apiStatusCode === 500) {
    //                 this.props.customProps._toastMessage('error', constants.SOMETHING_WENT_WRONG)
    //             }
    //             else {
    //                 this.props.customProps._toastMessage('error', err.message)
    //             }
    //         })
    //     })
    // }


    //calling update class api
    updateClass = () => {
        if (this.editClassValidation.allValid()) {
            let { editClassModal, teachers } = this.state;
            teachers = this.getTeachersInfo()

            let data = {
                id: editClassModal.id,
                class_age: editClassModal.class_age,
                class_name: editClassModal.class_name,
                room: editClassModal.room,
                location: editClassModal.location,
                teachers: teachers
            }
            console.log("For submitting the data for updating class: ", data);

            updateClass(data).then(res => {
                this.setState({
                    isFormLoading: false
                }, () => {
                    this.props.customProps._toastMessage("success", res.message);
                    this.props.history.push('/classes')
                })

            }).catch(err => {
                this.setState({
                    apiStatusCode: err ? err.status : 500,
                    isFormLoading: false
                }, () => {
                    if (this.state.apiStatusCode === 401) {
                        this.props.customProps._toastMessage('error', constants.SESSION_EXPIRED)
                        this.props._removeToken()
                    } else if (this.state.apiStatusCode === 500) {
                        this.props.customProps._toastMessage('error', constants.SOMETHING_WENT_WRONG)
                    } else {
                        this.props.customProps._toastMessage('error', err.message)
                    }
                })
            })

        } else {
            this.setState({
                isFormLoading: false
            }, () => {
                this.forceUpdate();
                this.editClassValidation.showMessages()
            })

        }
    }

    // calling add class api
    addClass = () => {

        if (this.editClassValidation.allValid()) {
            let { editClassModal, teachers } = this.state;
            teachers = this.getTeachersInfo()

            let data = {
                class_age: editClassModal.class_age,
                class_name: editClassModal.class_name,
                room: editClassModal.room,
                location: editClassModal.location,
                teachers: teachers
            }
            console.log("For submitting the data for adding class: ", data);

            adminClassCreate(data).then(res => {
                this.setState({
                    isFormLoading: false
                }, () => {
                    this.props.customProps._toastMessage("success", res.message);
                    this.props.history.push('/classes')
                })
            }).catch(err => {
                this.setState({
                    apiStatusCode: err ? err.status : 500,
                    isFormLoading: false
                }, () => {
                    if (this.state.apiStatusCode === 401) {
                        this.props.customProps._toastMessage('error', constants.SESSION_EXPIRED)
                        this.props._removeToken()
                    } else if (this.state.apiStatusCode === 500) {
                        this.props.customProps._toastMessage('error', constants.SOMETHING_WENT_WRONG)
                    } else {
                        this.props.customProps._toastMessage('error', err.message)
                    }
                })
            })
        } else {
            this.setState({
                isFormLoading: false
            }, () => {
                this.forceUpdate();
                this.editClassValidation.showMessages()
            })

        }
    }
    // handle input of all text
    handleInput = (event) => {
        let { name, value } = event.target,
            { editClassModal } = this.state;

        editClassModal[name] = value

        this.setState({
            editClassModal
        })
    }
    // handle dropdown value in all page
    handleDropdown = (event) => {
        let { id, value } = event.target, { first_teacher_name, second_teacher_name, third_teacher_name } = this.state;
        value = parseInt(value);
        if (id === "1") {
            if (value === second_teacher_name || value === third_teacher_name) {
                this.setState({
                    teacher1AlertMessage: `Teacher is already selected`
                })
            } else {
                this.setState({
                    first_teacher_name: value,
                    teacher1AlertMessage:''
                })
            }

        }
        else if (id === "2") {
            if (value === first_teacher_name || value === third_teacher_name) {
                this.setState({
                    teacher2AlertMessage: `Teacher is already selected`
                })
            } else {
                this.setState({
                    second_teacher_name: value,
                    teacher2AlertMessage:''
                })
            }

        } else {
            if (value === second_teacher_name || value === first_teacher_name) {
                this.setState({
                    teacher3AlertMessage: `Teacher is already selected`
                })
            } else {
                this.setState({
                    third_teacher_name: value,
                    teacher3AlertMessage:''
                })
            }

        }

    }
    handleMultiStudents=(e)=>{
         this.setState({
             students: e.target.value
         });
        console.log("I have the event value for multiselect as follows:", e.target.value);
        
    }

    //getting teacher class id and teacher id
    getTeachersInfo = () => {
        let {
            first_teacher_name,
            second_teacher_name,
            third_teacher_name,
            teachers,
        } = this.state;

        if (first_teacher_name) {
            teachers.push(first_teacher_name)
        }

        if (second_teacher_name) {
            teachers.push(second_teacher_name)
        }

        if (third_teacher_name) {
            teachers.push(third_teacher_name)
        }

        return teachers
    }

    render() {
        let { editClassModal,
            isFormLoading,
            loginUserInfo,
            allTeachersList,
            first_teacher_name,
            second_teacher_name,
            third_teacher_name,
            teacher1AlertMessage,
            teacher2AlertMessage,
            teacher3AlertMessage,
            foods,
            objectArray
        } = this.state;
        return (
            <div>
                {
                    isFormLoading === true ?
                        <Container>
                            <Loaders isLoading={isFormLoading} />
                        </Container>
                        :
                        <Container className="mt-5rem main-layout-height">

                            <Form onSubmit={this.showLoader} className={`admin-class-edit theme-${loginUserInfo.role_id}-border edit-form-layout`}>
                                <Form.Group widths="equal">
                                    <Form.Field required>
                                        <label>
                                            Class name
                            </label>
                                        <input style={{ height:"34px"}} type="text" name="class_name" value={editClassModal.class_name} onChange={this.handleInput} />
                                        {this.editClassValidation.message('class name is', editClassModal.class_name, 'required')}
                                    </Form.Field>
                                    <Form.Field required>
                                        <label>
                                            Class age
                            </label>
                                        <input style={{ height:"34px"}} type="text" name="class_age" value={editClassModal.class_age} onChange={this.handleInput} />
                                        {this.editClassValidation.message('class age is', editClassModal.class_age, 'required')}
                                    </Form.Field>
                                    <Form.Field />
                                </Form.Group>
                                <Form.Group widths="equal">
                                    <Form.Field required>
                                        <label>
                                            Room #
                            </label>
                                        <input style={{ height:"34px"}} type="text" name="room" value={editClassModal.room} onChange={this.handleInput} />
                                        {this.editClassValidation.message('class room is', editClassModal.room, 'required')}
                                    </Form.Field>
                                    <Form.Field required>
                                        <label>
                                            Location
                            </label>
                                        <input style={{ height:"34px"}} type="text" name="location" value={editClassModal.location} onChange={this.handleInput} />
                                        {this.editClassValidation.message('class location is', editClassModal.location, 'required')}
                                    </Form.Field>
                                    <Form.Field required>
                                        {console.log("I have the event updated state for multiselect as follows:", this.state.students)}
                                    <label>
                                            Students
                            </label>
                                         
                                            <div className="example-wrapper" >
                                            <MultiSelect
                                            style={{ width: '100%'}}
                                            name="foods"
                                            data={foods}
                                            value={this.state.students}
                                            textField="text"
                                            dataItemKey="id"
                                            onChange={this.handleMultiStudents}
                                        />
                                            </div>
                                            
                                    </Form.Field> 
                                </Form.Group>
                                <Form.Group widths="equal">
                                    <Form.Field>
                                        <label>
                                            Teacher 1
                                        </label>
                                        <select onChange={this.handleDropdown} value={first_teacher_name} id="1"  >
                                            <option value='' disabled>Select Teacher </option>
                                            {
                                                allTeachersList.length ?
                                                    allTeachersList.map((value, index) => {
                                                        let fullName = value.first_name + ' ' + value.last_name;
                                                        return (
                                                            <option key={index} value={value.id} >
                                                                {fullName}
                                                            </option>
                                                        )
                                                    })
                                                    : ''
                                            }
                                        </select>
                                        {
                                            teacher1AlertMessage ?
                                                <div>
                                                    <span className="color-red">
                                                        {teacher1AlertMessage}
                                                    </span>

                                                </div> : ''
                                        }
                                    </Form.Field>
                                    <Form.Field>
                                        <label>
                                            Teacher 2
                                        </label>
                                        <select onChange={this.handleDropdown} value={second_teacher_name} id="2" disabled={first_teacher_name?false :true}>
                                            <option value='' disabled>Select Teacher </option>
                                            {
                                                allTeachersList.length ?
                                                    allTeachersList.map((value, index) => {
                                                        let fullName = value.first_name + ' ' + value.last_name;

                                                        return (
                                                            <option key={index} value={value.id} >
                                                                {fullName}
                                                            </option>
                                                        )
                                                    })
                                                    : ''
                                            }
                                        </select>
                                        {
                                            teacher2AlertMessage ?
                                                <div>
                                                    <span className="color-red">
                                                        {teacher2AlertMessage}
                                                    </span>

                                                </div> : ''
                                        }
                                    </Form.Field>
                                    <Form.Field>
                                        <label>
                                            Teacher 3
                                        </label>
                                        <select onChange={this.handleDropdown} value={third_teacher_name} id="3" disabled={second_teacher_name?false :true}>
                                            <option value='' disabled>Select Teacher </option>
                                            {
                                                allTeachersList.length ?
                                                    allTeachersList.map((value, index) => {
                                                        let fullName = value.first_name + ' ' + value.last_name;
                                                        return (
                                                            <option key={index} value={value.id} >
                                                                {fullName}
                                                            </option>
                                                        )
                                                    })
                                                    : ''
                                            }
                                        </select>
                                        {
                                            teacher3AlertMessage ?
                                                <div>
                                                    <span className="color-red">
                                                        {teacher3AlertMessage}
                                                    </span>

                                                </div> : ''
                                        }
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths="equal">
                                    <Form.Field>
                                        <Button color="green" type="submit">
                                            Submit
                                    </Button>
                                    </Form.Field>
                                    <Form.Field />
                                    <Form.Field />
                                </Form.Group>
                            </Form>
                        </Container>

                }


            </div>
        )
    }
}


const mapStateToProps = state => ({
    loginUserInfo: state.loginReducer.loginUserInfo,
});

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditClass);

