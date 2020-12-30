import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal, DropdownButton} from "react-bootstrap"
import {Input, FormFeedback } from "reactstrap"
import PropTypes from "prop-types";
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class AddContactInfoModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      contactID: '',
      contactType: 'Email',
      name: '',
      info: '',
      title: '',
      value: '',
      location: '',
      errors: {
        contactID: '',
        name: '',
        info: '',
        title: '',
        value: '',
        location: '',
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
    if (this.state.contactID === '') {
      errors.contactID = 'Contact ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.name === '') {
      errors.name = 'Name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Information is required.';
      this.setState({errors});
      return;
    }

    if (this.state.title === '') {
      errors.title = 'Title is required.';
      this.setState({errors});
      return;
    }

    if (this.state.location === '') {
      errors.location = 'Location is required.';
      this.setState({errors});
      return;
    }

    if (this.state.value === '') {
      errors.value = 'Value is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/contact-info/', {
      contact_id: this.state.contactID,
      name: this.state.name,
      title: this.state.title,
      info: this.state.info,
      type: this.state.contactType,
      location: this.state.location,
      value: this.state.value,
    }).then(res => {
      toastr.success('Success!', 'Contact Info was successfully added.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to add Contact Info.');
    });
  };

  render() {
    const {
      errors,
      contactID,
      contactType,
      info,
      value,
      title,
      name,
      location
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
          <Modal.Title>Add Contact Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Contact ID" type="text" name="contactID" value={contactID}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.contactID}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Name<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Contact Name" type="text" name="name" value={name}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.name}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Title<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Contact Title" type="text" name="title" value={title}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.title}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <Input type="select" className="browser-default custom-select" name="contactType" value={contactType}
                        onChange={this.handleChangeInput} style={{fontSize: 16, marginTop:10}}>
                  <option value={'Email'}>Email</option>
                  <option value={'Phone'}>Phone</option>
                  <option value={'Mobile'}>Mobile</option>
                  <option value={'Chat'}>Chat</option>
                  <option value={'Social'}>Social</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Location<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Location" type="text" name="location" value={location}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.location}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Value<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Value" type="text" name="value" value={value}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.value}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Info<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl rows="5" componentClass="textarea" placeholder="Information" name="info" value={info}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.info}</FormFeedback>
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

AddContactInfoModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddContactInfoModal
