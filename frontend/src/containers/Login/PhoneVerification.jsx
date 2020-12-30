import React, {Component} from "react";
import {connect} from "react-redux"
import {Grid, Row, Col, FormGroup, Form, ControlLabel, FormControl} from "react-bootstrap";
import {toastr} from "react-redux-toastr";
import AuthNavbar from '../Layout/Navbars/AuthNavbar'
import bgImage from "../../assets/img/full-screen-image-3.jpg";
// import queryString from "query-string";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import ApiHelper from "../../helpers/apiHelper";
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import {Redirect} from "react-router";
import FormFeedback from "reactstrap/es/FormFeedback";
import {getUserInfo} from '../../redux/actions/auth.jsx';
import AuthHelper from "../../helpers/authHelper";

class PhoneVerificationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHidden: true,
      value: '',
      code: '',
      email: this.props.user.email,
      errors: {
        phoneNumber: '',
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

  // componentWillMount() {
  //   this.parameters = queryString.parse(this.props.location.search);
  //   if (!this.parameters.uid || !this.parameters.token) {
  //     this.props.history.push('/register')
  //   }
  // }

  handleVerify = e => {
    e.preventDefault();

    let phoneNumber = this.state.value;
    let code = this.state.code;
    let errors = this.state.errors;

    if (phoneNumber === '') {
      errors.phoneNumber = 'Phone number is required';
      this.setState({errors});
      return;
    }

    if (code === '') {
      errors.code = 'Verification code is required';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/auth/verify_phone', {
      // uid: this.parameters.uid,
      // token: this.parameters.token,
      phone_number: phoneNumber,
      code: code,
    }, {}, false).then(res => {
      console.log(res.data);
      toastr.success('Success!', 'Phone verification done successfully');
      this.props.history.push('/login');
    }).catch(err => {
      toastr.error('Fail!', 'Failed to verify phone number');
    });
  };

  handleSend = e => {
    e.preventDefault();

    let phoneNumber = this.state.value;
    let errors = this.state.errors;
    let email = this.state.email;

    if (phoneNumber === '') {
      errors.phoneNumber = 'Phone number is required';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/auth/send_sms_code', {
      phone_number: phoneNumber,
      email: email
    }, {}, false).then(res => {
      toastr.success('Success!', 'Please check your phone');
    }).catch(err => {
      toastr.error('Fail!', 'Failed to verify phone number');
    });

  };

  handleSkip = () => {
    console.log(this.props.isAuthenticated);
    if (this.props.isAuthenticated) {
      return (
        <Redirect to='/contact'/>
      )
    } else {
      this.props.history.push('/login')
    }
  };

  render() {
    // if (this.props.isAuthenticated) {
    //   return (
    //     <Redirect to='/'/>
    //   );
    // }
    let {value, code, errors} = this.state;

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
                  <Col md={4} sm={6} mdOffset={4} smOffset={3}>
                    <Form horizontal>
                      <Card
                        hidden={this.state.cardHidden}
                        textCenter
                        title="Verify Phone Number"
                        content={
                          <div>
                            <FormGroup>
                              <Col md={9}>
                                <PhoneInput
                                  placeholder="Enter phone number"
                                  value={value}
                                  // style={{fontSize: '18px'}}
                                  onChange={value => this.setState({ value })}
                                  error={value ? (isValidPhoneNumber(value) ?
                                    undefined : 'Invalid phone number') : 'Phone number required'}/>
                              </Col>
                              <Col md={3}>
                                <Button bsStyle="success" pullRight fill onClick={this.handleSend}>
                                  Send
                                </Button>
                              </Col>
                            </FormGroup>
                            <FormGroup>
                              <ControlLabel className="col-md-3">Code<span className="star">*</span></ControlLabel>
                              <Col md={9}>
                                <FormControl placeholder="Enter code" name="code" type="text"
                                             onChange={this.handleChangeInput} value={code}/>
                                <FormFeedback className="text-danger">{errors.code}</FormFeedback>
                              </Col>
                            </FormGroup>
                          </div>
                        }
                        legend={
                          <div>
                            <Button bsStyle="info" fill wd onClick={this.handleVerify}>
                              Verify
                            </Button>
                            <Button bsStyle="warning" fill pullRight onClick={this.handleSkip}>
                              Skip
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

const mapStateToProps = state => ({
  isAuthenticated: AuthHelper.isAuthenticated(state.auth),
  user: state.auth.user
});

const mapDispatchToProps = {
  getUserInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(PhoneVerificationPage);
// export default PhoneVerificationPage;
