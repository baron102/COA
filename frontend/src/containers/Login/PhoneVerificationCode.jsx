import React, {Component} from "react";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Form} from "react-bootstrap";
import {toastr} from "react-redux-toastr";
import AuthNavbar from '../Layout/Navbars/AuthNavbar'
import bgImage from "../../assets/img/full-screen-image-3.jpg";
import FormFeedback from "reactstrap/es/FormFeedback";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import ApiHelper from "../../helpers/apiHelper";
import 'react-phone-number-input/style.css'

class PhoneVerificationCodePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHidden: true,
      errors: {
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

  handleSubmit = e => {
    e.preventDefault();

    let code = e.target.elements.code.value;
    let errors = this.state.errors;

    if (code === '') {
      errors.code = 'Code number is required';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/auth/verify_phone', {
      code: code
    }, {}, false).then(res => {
      toastr.success('Success!', 'Phone verification done successfully');
      this.props.history.push('/login');
    }).catch(err => {
      toastr.error('Fail!', 'Failed to verify phone number.');
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
                  <Col md={4} sm={6} mdOffset={4} smOffset={3}>
                    <Form onSubmit={this.handleSubmit}>
                      <Card
                        hidden={this.state.cardHidden}
                        textCenter
                        title="Verify Phone Number"
                        content={
                          <div>
                            <FormGroup>
                              <ControlLabel>Code<span className="star">*</span></ControlLabel>
                                <FormControl placeholder="Enter code" name="code" type="text"
                                             onChange={this.handleChangeInput}/>
                                <FormFeedback className="text-danger">{errors.code}</FormFeedback>
                            </FormGroup>
                          </div>
                        }
                        legend={
                          <Button bsStyle="info" fill wd type="submit">
                            Submit
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

export default PhoneVerificationCodePage;
