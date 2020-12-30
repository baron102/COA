import React, { Component } from "react";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Form} from "react-bootstrap";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import FormFeedback from "reactstrap/es/FormFeedback";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import AuthHelper from '../../helpers/authHelper.jsx';
import {login} from '../../redux/actions/auth.jsx';
import {validateEmail} from '../../helpers/commonHelper.jsx';
import {toastr} from "react-redux-toastr";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHidden: true,
      errors: {
        email: '',
        password: ''
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

  handleLogin = e => {
    e.preventDefault();

    let email = e.target.elements.email.value;
    let password = e.target.elements.password.value;
    let errors = this.state.errors;

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

    this.props.login(email, password)
      .catch(err => {
        // console.log(err.response.data.non_field_errors[0]);
        if (err.response.data.non_field_errors[0] === 'register') {
          toastr.error('Login Failed!', 'Please register');
          this.props.history.push('/register')
        }else if (err.response.data.non_field_errors[0] === 'email') {
          toastr.error('Login Failed!', 'Please verify your email address');
          this.props.history.push('/login/email_verification')
        }
      })
  };

  handleChangeInput = e => {
    let errors = this.state.errors;
    if (errors[e.target.name] !== '') {
      errors[e.target.name] = '';
      this.setState(errors);
    }
  };

  render() {
    if (this.props.isAuthenticated) {
      return (
        <Redirect to='/id'/>
      )
    } else {
      let {errors} = this.state;
      const url = `/reset_password`;
      return (
        <Grid>
          <Row>
            <Col md={4} sm={6} mdOffset={4} smOffset={3}>
              <Form onSubmit={this.handleLogin}>
                <Card
                  hidden={this.state.cardHidden}
                  textCenter
                  title="Login"
                  content={
                    <div>
                      <FormGroup>
                        <ControlLabel>Email address<span className="star">*</span></ControlLabel>
                        <FormControl placeholder="Enter email" name="email" type="email"
                                     onChange={this.handleChangeInput}/>
                        <FormFeedback className="text-danger">{errors.email}</FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <ControlLabel>
                          Password<span className="star">*</span>
                          <a href={url}><span style={{marginLeft: '140px'}}>Forgot Password?</span></a>
                        </ControlLabel>
                        <FormControl placeholder="Password" name="password" type="password" autoComplete="off"
                                     onChange={this.handleChangeInput}/>
                        <FormFeedback className="text-danger">{errors.password}</FormFeedback>
                      </FormGroup>
                    </div>
                  }
                  legend={
                    <Button bsStyle="info" fill wd type="submit">
                      Login
                    </Button>
                  }
                  ftTextCenter
                />
              </Form>
            </Col>
          </Row>
        </Grid>
      );
    }
  }
}

const mapStateToProps = state => ({
  isAuthenticated: AuthHelper.isAuthenticated(state.auth)
});

// const mapDispatchToProps = {
//   login,
// };

const mapDispatchToProps = (dispatch) => ({
  login: (username, password) => dispatch(login(username, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
