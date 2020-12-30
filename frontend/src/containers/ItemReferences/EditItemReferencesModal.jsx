import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import {Input, FormFeedback} from "reactstrap";
import PropTypes from "prop-types";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class EditItemReferencesModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      item_id: this.props.selectedID.item_id,
      reference_type: this.props.selectedID.reference_type,
      reference_value: this.props.selectedID.reference_value,
      reference_source: this.props.selectedID.reference_source,
      info: this.props.selectedID.info,
      errors: {
        item_id: '',
        reference_type: '',
        reference_value: '',
        reference_source: '',
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
    if (this.state.item_id === '') {
      errors.item_id = 'Item ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.reference_type === '') {
      errors.reference_type = 'Reference Type is required.';
      this.setState({errors});
      return;
    }

    if (this.state.reference_value === '') {
      errors.reference_value = 'Reference Value is required.';
      this.setState({errors});
      return;
    }

    if (this.state.reference_source === '') {
      errors.reference_source = 'Reference Source is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Information is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.put(`/api/item_references/${this.props.selectedID.id}/`, {
      item_id: this.state.item_id,
      reference_type: this.state.reference_type,
      reference_value: this.state.reference_value,
      reference_source: this.state.reference_source,
      info: this.state.info,
    }).then(res => {
      toastr.success('Success!', 'Item Reference was successfully updated.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to update Item Reference.');
    });
  };

  render() {
    const {
      errors,
      item_id,
      reference_type,
      reference_value,
      reference_source,
      info,
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
          <Modal.Title>Edit Item Reference</Modal.Title>
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
              <ControlLabel className="col-md-3">Reference Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Reference Type" type="text" name="reference_type" value={reference_type}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.reference_type}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Version<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Reference Value" type="text" name="reference_value" value={reference_value}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.reference_value}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Reference Source<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Reference Source" type="text" name="reference_source" value={reference_source}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.reference_source}</FormFeedback>
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

EditItemReferencesModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedID: PropTypes.object
};

export default EditItemReferencesModal
