import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import {Input, FormFeedback} from "reactstrap";
import PropTypes from "prop-types";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class EditEntityModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      entityID: this.props.selectedEntity.entity_id,
      entityName: this.props.selectedEntity.entity_name,
      entityType: this.props.selectedEntity.entity_type,
      errors: {
        entityID: '',
        entityName: '',
        entityType: ''
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

    if (this.state.entityID === '') {
      errors.entityID = 'Entity id is required.';
      this.setState({errors});
      return;
    }

    if (this.state.entityName === '') {
      errors.entityName = 'Entity name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.entityType === '') {
      errors.entityType = 'Entity type is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.put(`/api/entities/${this.props.selectedEntity.id}/`, {
      entity_id: this.state.entityID,
      entity_name: this.state.entityName,
      entity_type: this.state.entityType,
    }).then(res => {
      toastr.success('Success!', 'Entity was successfully updated.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to update Entity.');
    });
  };

  render() {
    console.log(this.props.selectedID)
    const {
      errors,
      entityID,
      entityName,
      entityType,
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
          <Modal.Title>Edit Entity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Entity ID" type="text" name="entityID" value={entityID}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.entityID}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Name<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Entity Name" type="text" name="entityName" value={entityName}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.entityName}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Entity Type" type="text" name="entityType" value={entityType}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.entityType}</FormFeedback>
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

EditEntityModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedEntity: PropTypes.object
};

export default EditEntityModal
