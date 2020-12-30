import React, {Component} from 'react';
import {toastr} from "react-redux-toastr";
import {FormFeedback} from "reactstrap"
import {Grid, Row, Col, FormGroup, FormControl} from "react-bootstrap";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import bgImage from "../../assets/img/full-screen-image-3.jpg";
import AuthNavbar from "../Layout/Navbars/AuthNavbar.jsx";
import ApiHelper from '../../helpers/apiHelper.jsx';

class ResetPasswordEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHidden : true,
      users: [],
      errors: {
        email: ''
      }
    }
  }

  componentDidMount() {
    // this.getUsers();
    setTimeout(
      function() {
        this.setState({ cardHidden: false });
      }.bind(this),
      700
    );
  }

  handleSubmit = e => {
    e.preventDefault();
    let email = e.target.elements.email.value;
    let errors = this.state.errors;

    if (email === '') {
      errors.email = 'Email address is required.';
      this.setState(errors);
      return;
    }

    ApiHelper.post('/api/auth/user/reset_password', {
      email: email
    }, {},  false).then(res => {
      toastr.success('Success!', 'Reset Password request was successfully sent.');
      this.props.history.push('/login');
    }).catch(err => {
      toastr.error('Fail!', 'This is not a verified email address.');
      // this.props.history.push('/login');
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
                  <Col md={4} sm={6} mdOffset={4} smOffset={3}>
                    <form onSubmit={this.handleSubmit}>
                      <Card
                        hidden={this.state.cardHidden}
                        textCenter
                        title="Reset your password"
                        content={
                          <div>
                            <p>Enter your user account's verified email address and we will send you a password reset link.</p>
                            <FormGroup>
                              <FormControl placeholder="Enter your email address" name="email" type="email"
                                     onChange={this.handleChangeInput}/>
                              <FormFeedback className="text-danger">{errors.email}</FormFeedback>
                            </FormGroup>
                          </div>
                        }
                        legend={
                          <div>
                            <Button bsStyle="info" fill wd type="submit">
                              Send Password Reset Email
                            </Button>
                          </div>
                        }
                        ftTextCenter
                      />
                    </form>
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

export default ResetPasswordEmail;
