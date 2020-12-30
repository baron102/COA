import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import {Input, FormFeedback} from "reactstrap";
import PropTypes from "prop-types";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class EditMenuItemsModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      menu_id: this.props.selectedID.menu_id,
      description: this.props.selectedID.description,
      status: this.props.selectedID.status,
      info: this.props.selectedID.info,
      container_pod: this.props.selectedID.container_pod,
      help_text: this.props.selectedID.help_text,      
      last_used: this.props.selectedID.last_used,
      usage_count: this.props.selectedID.usage_count,
      roles_used: this.props.selectedID.roles_used,
      errors: {
        menu_id: '',
        description: '',
        status: '',
        info: '',
        container_pod: '',
        help_text: '',
        last_used: '',
        usage_count: '',
        roles_used: '',        
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
    if (this.state.menu_id === '') {
      errors.menu_id = 'Menu ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.description === '') {
      errors.description = 'Description is required.';
      this.setState({errors});
      return;
    }

    if (this.state.status === '') {
      errors.status = 'Status is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Info is required.';
      this.setState({errors});
      return;
    }

    if (this.state.container_pod === '') {
      errors.container_pod = 'Container POD is required.';
      this.setState({errors});
      return;
    }

    if (this.state.help_text === '') {
      errors.help_text = 'HelpText is required.';
      this.setState({errors});
      return;
    }

    if (this.state.last_used === '') {
      errors.last_used = 'Last Used is required.';
      this.setState({errors});
      return;
    }

    if (this.state.usage_count === '') {
      errors.usage_count = 'Usage Count is required.';
      this.setState({errors});
      return;
    }

    if (this.state.roles_used === '') {
      errors.roles_used = 'Roles Used is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.put(`/api/menu_items/${this.props.selectedID.id}/`, {
      menu_id: this.state.menu_id,
      description: this.state.description,
      info: this.state.info,
      type: this.state.type,
      container_pod: this.state.container_pod,
      help_text: this.state.help_text,
      last_used: this.state.last_used,
      roles_used: this.state.roles_used,
      usage_count: this.state.usage_count,
      entity: this.state.entity,
      status: this.state.status,
    }).then(res => {
      toastr.success('Success!', 'Menu Items was successfully updated.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to update Menu Items.');
    });
  };

  render() {
    const {
      errors,
      menu_id,
      description,
      type,
      container_pod,
      help_text,
      status,
      last_used,
      usage_count,
      roles_used,
      info,
      entity
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
          <Modal.Title>Edit Trans ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
          <FormGroup>
              <ControlLabel className="col-md-3">Menu ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Menu ID" status="text" name="menu_id" value={menu_id}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.menu_id}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Description<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Description" status="text" name="description" value={description}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.description}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Status<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Status" status="text" name="status" value={status}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.status}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Info<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Info" status="text" name="info" value={info}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.info}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Container POD<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Container POD" status="text" name="container_pod" value={container_pod}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.container_pod}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Help Text<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Help Text" status="text" name="help_text" value={help_text}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.help_text}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Last Used<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Last Used" status="text" name="last_used" value={last_used}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.last_used}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Usage Count<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Usage Count" status="text" name="usage_count" value={usage_count}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.usage_count}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Roles Used<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Roles Used" status="text" name="roles_used" value={roles_used}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.roles_used}</FormFeedback>
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

EditMenuItemsModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedID: PropTypes.object
};

export default EditMenuItemsModal
