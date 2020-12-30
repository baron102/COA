import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal, DropdownButton} from "react-bootstrap"
import {Input, FormFeedback } from "reactstrap"
import PropTypes from "prop-types";
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class AddItemModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      item_id: '',
      short_description: '',
      long_description: '',
      item_type: '',
      last_used: '',
      zip: '',
      location_name: '',
      info: '',
      errors: {
        item_id: '',
        short_description: '',
        long_description: '',
        item_type: '',
        last_used: '',
        zip: '',
        location_name: '',
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

  onClickAdd = () => {
    let errors = this.state.errors;
    if (this.state.item_id === '') {
      errors.item_id = 'Item ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.short_description === '') {
      errors.short_description = 'Short Description is required.';
      this.setState({errors});
      return;
    }

    if (this.state.long_description === '') {
      errors.long_description = 'Long Description is required.';
      this.setState({errors});
      return;
    }

    if (this.state.item_type === '') {
      errors.item_type = 'Item Type is required.';
      this.setState({errors});
      return;
    }

    if (this.state.last_used === '') {
      errors.last_used = 'Last Used is required.';
      this.setState({errors});
      return;
    }

    if (this.state.zip === '') {
      errors.zip = 'Zip is required.';
      this.setState({errors});
      return;
    }

    if (this.state.location_name === '') {
      errors.location_name = 'Location Name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Information is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/items/', {
      item_id: this.state.item_id,
      short_description: this.state.short_description,
      info: this.state.info,
      long_description: this.state.long_description,
      item_type: this.state.item_type,
      zip: this.state.zip,
      location_name: this.state.location_name,
      last_used: this.state.last_used,
    }).then(res => {
      toastr.success('Success!', 'Item was successfully added.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to add Item.');
    });
  };

  render() {
    const {
      errors,
      item_id,
      short_description,
      info,
      long_description,
      item_type,
      zip,
      location_name,
      last_used
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
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">Item ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Item ID" type="text" name="item_id" value={item_id}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.item_id}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Short Description<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Short Description" type="text" name="short_description" value={short_description}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.short_description}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Long Description<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Long Description" type="text" name="long_description" value={long_description}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.long_description}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Itemem Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Item Type" type="text" name="item_type" value={item_type}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.item_type}</FormFeedback>
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
              <ControlLabel className="col-md-3">Location Name<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Location Name" type="text" name="location_name" value={location_name}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.location_name}</FormFeedback>
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
            <FormGroup>
              <ControlLabel className="col-md-3">Last Used<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Last Used" type="text" name="last_used" value={last_used}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.last_used}</FormFeedback>
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

AddItemModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddItemModal
