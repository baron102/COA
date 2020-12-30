import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import {Input, FormFeedback} from "reactstrap";
import PropTypes from "prop-types";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class EditContactAddressModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      contactID: this.props.selectedContactAddress.contact_id,
      type: this.props.selectedContactAddress.type,
      address1: this.props.selectedContactAddress.address1,
      address2: this.props.selectedContactAddress.address2,
      city: this.props.selectedContactAddress.city,
      state: this.props.selectedContactAddress.state,
      zip: this.props.selectedContactAddress.zip,
      info: this.props.selectedContactAddress.info,
      location: this.props.selectedContactAddress.location,
      errors: {
        contactID: '',
        type: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        location: '',
        info: '',
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

  onClickSave = () => {
    let errors = this.state.errors;
    if (this.state.contactID === '') {
      errors.contactID = 'Contact ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.type === '') {
      errors.type = 'Type is required.';
      this.setState({errors});
      return;
    }

    if (this.state.address1 === '') {
      errors.address1 = 'Address is required.';
      this.setState({errors});
      return;
    }

    if (this.state.address2 === '') {
      errors.address2 = 'Address is required.';
      this.setState({errors});
      return;
    }

    if (this.state.city === '') {
      errors.city = 'City is required.';
      this.setState({errors});
      return;
    }

    if (this.state.state === '') {
      errors.state = 'State is required.';
      this.setState({errors});
      return;
    }

    if (this.state.zip === '') {
      errors.zip = 'Zip is required.';
      this.setState({errors});
      return;
    }

    if (this.state.location === '') {
      errors.location = 'Location is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Information is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.put(`/api/contact-address/${this.props.selectedContactAddress.id}/`, {
      contact_id: this.state.contactID,
      type: this.state.type,
      address1: this.state.address1,
      address2: this.state.address2,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      location: this.state.location,
      info: this.state.info
    }).then(res => {
      toastr.success('Success!', 'Contact Address was successfully updated.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to update Contact Address.');
    });
  };

  render() {
    const {
      errors,
      contactID,
      type,
      address1,
      address2,
      city,
      state,
      zip,
      info,
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
          <Modal.Title>Edit Contact Address</Modal.Title>
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
              <ControlLabel className="col-md-3">Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Contact Type" type="text" name="type" value={type}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.name}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Address1<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Address1" type="text" name="address1" value={address1}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.address1}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Address2<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Address2" type="text" name="address2" value={address2}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.address2}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">City<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="City" type="text" name="city" value={city}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.city}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">State<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="State" type="text" name="state" value={state}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.state}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Zip<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Zip" type="text" name="zip" value={zip}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.zip}</FormFeedback>
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
          <Button bsStyle="success" fill onClick={this.onClickSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

EditContactAddressModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedContactAddress: PropTypes.object
};

export default EditContactAddressModal
