import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import {Input, FormFeedback} from "reactstrap";
import PropTypes from "prop-types";
import ApiHelper from '../../helpers/apiHelper.jsx';
import {validateEmail} from '../../helpers/commonHelper.jsx';

class EditUserModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.user.email,
      firstName: this.props.user.first_name,
      lastName: this.props.user.last_name,
      errors: {
        email: '',
        firstName: '',
        lastName: '',
      }
    };

    if (this.props.user.user_role === "Grader") {
      this.state.userRole = 3
    }

    if (this.props.user.user_role === "Student") {
      this.state.userRole = 4
    }

    if (this.props.user.phone_number){
      this.state.phoneNumber = this.props.user.phone_number
    } else {
      this.state.phoneNumber = ''
    }
  }

  handleChangeInput = e => {
    let errors = this.state.errors;
    if (errors[e.target.name] !== '') {
      errors[e.target.name] = '';
      this.setState({errors});
    }
    this.setState({[e.target.name]: e.target.value});
  };

  onClickSave = () => {
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
      errors.email = 'Email is invalid.';
      this.setState({errors});
      return;
    }

    ApiHelper.put(`/api/users/${this.props.user.id}/`, {
      user_role: this.state.userRole,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      phone_number: this.state.phoneNumber,
    }).then(res => {
      toastr.success('Success!', 'User was successfully updated.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to update User.');
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
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">First Name<span className="star">*</span></ControlLabel>
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
                <FormControl placeholder="Email" type="email" name="email" value={email} disabled
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
              <ControlLabel className="col-md-3">Edit Role<span className="star">*</span></ControlLabel>
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
          <Button bsStyle="success" fill onClick={this.onClickSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

EditUserModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  user: PropTypes.object
};

export default EditUserModal
