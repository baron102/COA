import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import {Input, FormFeedback} from "reactstrap";
import PropTypes from "prop-types";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class EditRoleMenuModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      role_name: this.props.selectedID.role_name,
      menu_id: this.props.selectedID.menu_id,
      type: this.props.selectedID.type,
      title: this.props.selectedID.title,
      value: this.props.selectedID.value,
      location: this.props.selectedID.location,
      info: this.props.selectedID.info,
      errors: {
        role_name: '',
        menu_id: '',
        type: '',
        title: '',
        value: '',
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
    if (this.state.role_name === '') {
      errors.role_name = 'Role Name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.menu_id === '') {
      errors.menu_id = 'Menu ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.type === '') {
      errors.type = 'Type is required.';
      this.setState({errors});
      return;
    }

    if (this.state.title === '') {
      errors.title = 'Title is required.';
      this.setState({errors});
      return;
    }

    if (this.state.value === '') {
      errors.value = 'Version is required.';
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

    ApiHelper.put(`/api/role_menu/${this.props.selectedID.id}/`, {
      role_name: this.state.role_name,
      menu_id: this.state.menu_id,
      info: this.state.info,
      type: this.state.type,
      title: this.state.title,
      value: this.state.value,
      location: this.state.location,
    }).then(res => {
      toastr.success('Success!', 'Role Menu was successfully updated.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to update Role Menu.');
    });
  };

  render() {
    const {
      errors,
      role_name,
      menu_id,
      type,
      title,
      value,
      location,
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
          <Modal.Title>Edit Role Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
          <FormGroup>
              <ControlLabel className="col-md-3">Role Name<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Role Name" type="text" name="role_name" value={role_name}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.role_name}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Menu ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Menu ID" type="text" name="menu_id" value={menu_id}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.menu_id}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Type" type="text" name="type" value={type}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.type}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Title<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Title" type="text" name="title" value={title}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.title}</FormFeedback>
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
            <FormGroup>
              <ControlLabel className="col-md-3">Location<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Location" type="text" name="location" value={location}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.location}</FormFeedback>
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

EditRoleMenuModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedID: PropTypes.object
};

export default EditRoleMenuModal
