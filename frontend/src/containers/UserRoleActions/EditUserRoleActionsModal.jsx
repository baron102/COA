import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import {Input, FormFeedback} from "reactstrap";
import PropTypes from "prop-types";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class EditUserRoleActionsModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.selectedUserRoleActions.user,
      role: this.props.selectedUserRoleActions.role,
      actions_allowed: this.props.selectedUserRoleActions.actions_allowed,
      errors: {
        user: '',
        role: '',
        actions_allowed: '',
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
    if (this.state.user === '') {
      errors.user = 'User is required.';
      this.setState({errors});
      return;
    }

    if (this.state.role === '') {
      errors.role = 'Role is required.';
      this.setState({errors});
      return;
    }

    if (this.state.actions_allowed === '') {
      errors.actions_allowed = 'ActionsAllowed is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.put(`/api/user_role_actions/${this.props.selectedUserRoleActions.id}/`, {
      user: this.state.user,
      role: this.state.role,
      actions_allowed: this.state.actions_allowed,
    }).then(res => {
      toastr.success('Success!', 'UserRoleActions was successfully updated.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to update UserRoleActions.');
    });
  };

  render() {
    const {
      errors,
      user,
      role,
      actions_allowed
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
          <Modal.Title>Edit Roles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">User<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="User" type="text" name="user" value={user}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.user}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Role<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Role" type="text" name="role" value={role}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.role}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">ActionsAllowed<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="ActionsAllowed" type="text" name="actions_allowed" value={actions_allowed}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.actions_allowed}</FormFeedback>
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

EditUserRoleActionsModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedUserRoleActions: PropTypes.object
};

export default EditUserRoleActionsModal
