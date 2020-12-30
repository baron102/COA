import React, {Component} from "react";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Form} from "react-bootstrap";
import {toastr} from "react-redux-toastr";
import AuthNavbar from '../Layout/Navbars/AuthNavbar'
import bgImage from "../../assets/img/full-screen-image-3.jpg";
// import queryString from "query-string";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import ApiHelper from "../../helpers/apiHelper";
import {Redirect} from "react-router";
import {FormFeedback} from "reactstrap"

class EmailVerificationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHidden: true,
      email: '',
      code: '',
      errors: {
        email: '',
        code: ''
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

  handleChangeInput = e => {
    let errors = this.state.errors;
    if (errors[e.target.name] !== '') {
      errors[e.target.name] = '';
      this.setState({errors});
    }
    this.setState({[e.target.name]: e.target.value});
  };

  handleVerify = e => {
    e.preventDefault();

    let email = this.state.email;
    let code = this.state.code;
    let errors = this.state.errors;

    if (email === '') {
      errors.email = 'Email address is required';
      this.setState({errors});
      return;
    }

    if (code === '') {
      errors.code = 'Verification code is required';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/auth/verify_email', {
      code: code,
      email: email
    }, {}, false).then(res => {
      this.props.history.push('/login');
    }).catch(err => {
      toastr.error('Fail!', 'Failed to verify email address');
    });
  };

  handleCancel = () => {
    this.props.history.push('/register')
  };

  handleResend = e => {
    e.preventDefault();

    let email = this.state.email;
    let errors = this.state.errors;

    if (email === '') {
      errors.email = 'Email address is required';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/auth/resend_email', {
      email: email
    }, {}, false).then(res => {
      toastr.success('Success!', 'Please check your email');
    }).catch(err => {
      toastr.error('Fail!', 'Failed to resend email');
    });

  }

  render() {
    if (this.props.isAuthenticated) {
      return (
        <Redirect to='/'/>
      );
    }
    let {email, code, errors} = this.state;

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
                    <Form horizontal>
                      <Card
                        hidden={this.state.cardHidden}
                        textCenter
                        title="Verify Your Email Address"
                        content={
                          <div>
                            <FormGroup>
                              <ControlLabel className="col-md-3">Email<span className="star">*</span></ControlLabel>
                              <Col md={6}>
                                <FormControl placeholder="Enter your email address" type="email" name="email" value={email}
                                     onChange={this.handleChangeInput}/>
                                <FormFeedback className="text-danger">{errors.email}</FormFeedback>
                              </Col>
                              <Col md={3}>
                                <Button bsStyle="success" pullRight fill onClick={this.handleResend}>
                                  Resend
                                </Button>
                              </Col>
                            </FormGroup>
                            <FormGroup>
                              <ControlLabel className="col-md-3">Code<span className="star">*</span></ControlLabel>
                              <Col md={9}>
                                <FormControl placeholder="Enter your code" type="text" name="code" value={code}
                                     onChange={this.handleChangeInput}/>
                                <FormFeedback className="text-danger">{errors.code}</FormFeedback>
                              </Col>
                            </FormGroup>
                          </div>
                        }
                        legend={
                          <div>
                            <Button bsStyle="info" fill onClick={this.handleVerify}>
                              Verify
                            </Button>
                            <Button bsStyle="warning" pullRight fill onClick={this.handleCancel}>
                              Cancel
                            </Button>
                          </div>
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

export default EmailVerificationPage;
