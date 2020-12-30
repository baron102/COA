import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {Input, FormFeedback } from "reactstrap"
import PropTypes from "prop-types";
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import ApiHelper from '../../helpers/apiHelper.jsx';
import {validateEmail} from '../../helpers/commonHelper.jsx';

class AddUserModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      userRole: '3',
      email: '',
      adminId: this.props.user.admin_id,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      errors: {
        email: '',
        firstName: '',
        lastName: '',
      }
    };
  }

  handleChangeInput = e => {
    let errors = this.state.errors;
    if (errors[e.target.name] !== '') {
      errors[e.target.name] = '';
      this.setState({errors});
    }
    this.setState({[e.target.name]: e.target.value});
  };

  onClickAdd = () => {
    let errors = this.state.errors;
    if (this.state.firstName === '') {
      errors.firstName = 'First name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.lastName === '') {
      errors.lastName = 'Last name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.email === '') {
      errors.email = 'Email is required.';
      this.setState({errors});
      return;
    }

    if (!validateEmail(this.state.email)) {
      errors.email = 'Email is invalid and format should be john@doe.com.';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/users/', {
      user_role: this.state.userRole,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      admin_id: this.state.adminId,
      phone_number: this.state.phoneNumber,
    }).then(res => {
      toastr.success('Success!', 'User was successfully added.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to add user.');
    });
  };

  render() {
    const {
      errors,
      firstName,
      lastName,
      email,
      phoneNumber,
      userRole
    } = this.state;

    const {
      show,
      onHide
    } = this.props;

    return(
      <Modal
        show={show} onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">
                First Name<span className="star">*</span>
              </ControlLabel>
              <Col md={9}>
                <FormControl placeholder="First Name" type="text" name="firstName" value={firstName}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.firstName}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Last Name<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Last Name" type="text" name="lastName" value={lastName}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.lastName}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Email<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Email" type="email" name="email" value={email}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.email}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Phone Number</ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Phone Number" type="text" name="phoneNumber" value={phoneNumber}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.phoneNumber}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Choose Role<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <Input type="select" className="browser-default custom-select" name="userRole" value={userRole}
                        onChange={this.handleChangeInput} style={{fontSize: 16, marginTop:10}}>
                  <option value={3}>Grader</option>
                  <option value={4}>Student</option>
                </Input>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button simple onClick={onHide}>Cancel</Button>
          <Button bsStyle="success" fill onClick={this.onClickAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

AddUserModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddUserModal
