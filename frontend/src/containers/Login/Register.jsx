import React, { Component } from "react";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Form} from "react-bootstrap";
import {toastr} from "react-redux-toastr";
import AuthNavbar from '../Layout/Navbars/AuthNavbar'
import bgImage from "../../assets/img/full-screen-image-3.jpg";
import FormFeedback from "reactstrap/es/FormFeedback";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import ApiHelper from "../../helpers/apiHelper";
import {validateEmail} from '../../helpers/commonHelper.jsx';

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHidden: true,
      errors: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPwd: ''
      }
    };
  }

  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ cardHidden: false });
      }.bind(this),
      700
    );
  }

  handleRegister = e => {
    e.preventDefault();

    let email = e.target.elements.email.value;
    let firstName = e.target.elements.firstName.value;
    let lastName = e.target.elements.lastName.value;
    let password = e.target.elements.password.value;
    let confirmPwd = e.target.elements.confirmPwd.value;
    let errors = this.state.errors;

    if (firstName === '') {
      errors.firstName = 'First name is required';
      this.setState({errors});
      return;
    }

    if (lastName === '') {
      errors.lastName = 'Last name is required';
      this.setState({errors});
      return;
    }

    if (email === '') {
      errors.email = 'Email is required';
      this.setState({errors});
      return;
    }

    if (!validateEmail(email)) {
      errors.email = 'Email is invalid.';
      this.setState({errors});
      return;
    }

    if (password === '') {
      errors.password = 'Password is required';
      this.setState({errors});
      return;
    }

    if (confirmPwd !== password) {
      errors.confirmPwd = 'Password does not match';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/auth/register', {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    }, {}, false).then(res => {
      toastr.success('Success!', 'User was successfully registered.');
      this.props.history.push('/login');
    }).catch(err => {
      if (err.response.status === 400){
        toastr.error('Fail!', 'This email has already registered, please login or use another email to signup');
        this.props.history.push('/login')
      }
    });
  };

  handleChangeInput = e => {
    let errors = this.state.errors;
    if (errors[e.target.name] !== '') {
      errors[e.target.name] = '';
      this.setState(errors);
    }
  };

  render() {
    let {errors} = this.state;

    return (
      <div>
        <AuthNavbar />
        <div className="wrapper wrapper-full-page">
          <div
            className={"full-page login"}
            data-color="black"
            data-image={bgImage}
          >
            <div className="content">
              <Grid>
                <Row>
                  <Col md={5} sm={6} mdOffset={4} smOffset={3}>
                    <Form onSubmit={this.handleRegister}>
                      <Card
                        hidden={this.state.cardHidden}
                        textCenter
                        title="Register"
                        content={
                          <div>
                            <FormGroup>
                              <ControlLabel>First Name<span className="star">*</span></ControlLabel>
                              <FormControl placeholder="First Name" name="firstName" type="text"
                                           onChange={this.handleChangeInput}/>
                              <FormFeedback className="text-danger">{errors.firstName}</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                              <ControlLabel>Last Name<span className="star">*</span></ControlLabel>
                              <FormControl placeholder="Last Name" name="lastName" type="text"
                                           onChange={this.handleChangeInput}/>
                              <FormFeedback className="text-danger">{errors.lastName}</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                              <ControlLabel>Email address<span className="star">*</span></ControlLabel>
                              <FormControl placeholder="Email Address" name="email" type="email"
                                           onChange={this.handleChangeInput}/>
                              <FormFeedback className="text-danger">{errors.email}</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                              <ControlLabel>Password<span className="star">*</span></ControlLabel>
                              <FormControl placeholder="Password" name="password" type="password" autoComplete="off"
                                           onChange={this.handleChangeInput}/>
                              <FormFeedback className="text-danger">{errors.password}</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                              <ControlLabel>Confirm Password<span className="star">*</span></ControlLabel>
                              <FormControl placeholder="Confirm Password" name="confirmPwd" type="password"
                                           autoComplete="off" onChange={this.handleChangeInput}/>
                              <FormFeedback className="text-danger">{errors.confirmPwd}</FormFeedback>
                            </FormGroup>
                          </div>
                        }
                        legend={
                          <Button bsStyle="info" fill wd type="submit">
                            Register
                          </Button>
                        }
                        ftTextCenter
                      />
                    </Form>
                  </Col>
                </Row>
              </Grid>
            </div>
            <div
              className="full-page-background"
              style={{ backgroundImage: "url(" + bgImage + ")" }}
            >
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterPage;
