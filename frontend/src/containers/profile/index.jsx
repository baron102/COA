import React, { Component } from "react";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Form} from "react-bootstrap"
import {FormFeedback} from "reactstrap"
import {toastr} from "react-redux-toastr";
import {connect} from "react-redux"
import AuthHelper from "../../helpers/authHelper";
import Button from "../../components/CustomButton/CustomButton.jsx";
import {GET_USER_INFO_SUCCESS} from '../../redux/actions/auth';
import {validateEmail} from '../../helpers/commonHelper';

class EditProfile extends Component {
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

  handleSave = e => {
    e.preventDefault();

    if (this.state.email === '') {
      let errors = this.state.errors;
      errors.email = 'Email is required.';
      this.setState({errors});
      return;
    }

    if (!validateEmail(this.state.email)) {
      let errors = this.state.errors;
      errors.email = 'Email is invalid.';
      this.setState({errors});
      return;
    }

    AuthHelper.updateProfile({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      phone_number: this.state.phoneNumber
    }).then(res => {
        this.props.updateProfile(res.data);
        toastr.success('Success!', 'Profile was successfully updated.');
      }).catch(err => {
        let errors = this.state.errors;
        let data = err.response.data;
        for(let key in data) {
          errors[key] = data[key][0];
          this.setState({errors});
        }
    });

  }

  render() {
    const {
      errors,
      email,
      firstName,
      lastName,
      phoneNumber,
    } = this.state

    if (!this.props.user){
      return null
    }

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={6}>
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
                    <FormControl placeholder="Email" type="email" name="email" value={email} disabled/>
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
                  <Col md={3}></Col>
                  <Col md={9}>
                    <Button bsStyle="info" pullRight fill onClick={this.handleSave}>
                      Update Profile
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = {
  updateProfile: payload => {
    return {
      type: GET_USER_INFO_SUCCESS,
      payload
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
