import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import {Input, FormFeedback} from "reactstrap";
import PropTypes from "prop-types";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class EditRolesModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      roleName: this.props.selectedRoles.role_name,
      userCount: this.props.selectedRoles.user_count,
      errors: {
        roleName: '',
        userCount: '',
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
    if (this.state.roleName === '') {
      errors.roleName = 'Role Name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.userCount === '') {
      errors.userCount = 'User Count is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.put(`/api/roles/${this.props.selectedRoles.id}/`, {
      roleName: this.state.roleName,
      userCount: this.state.userCount,
    }).then(res => {
      toastr.success('Success!', 'Roles was successfully updated.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to update Roles.');
    });
  };

  render() {
    const {
      errors,
      roleName,
      userCount
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
              <ControlLabel className="col-md-3">Role Name<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Role Name" type="text" name="roleName" value={roleName}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.roleName}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">User Count<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="User Count" type="text" name="userCount" value={userCount}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.userCount}</FormFeedback>
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

EditRolesModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedRoles: PropTypes.object
};

export default EditRolesModal
