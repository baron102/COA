import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal, DropdownButton} from "react-bootstrap"
import {Input, FormFeedback } from "reactstrap"
import PropTypes from "prop-types";
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class AddRolesModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      roleName: '',
      userCount: '',
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

  onClickAdd = () => {
    let errors = this.state.errors;
    if (this.state.roleName === '') {
      errors.roleName = 'Role name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.userCount === '') {
      errors.type = 'User count is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/roles/', {
      role_name: this.state.roleName,
      user_count: this.state.userCount,
    }).then(res => {
      toastr.success('Success!', 'Role was successfully added.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to add Role.');
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
          <Modal.Title>Add Roles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Role Name" type="text" name="roleName" value={roleName}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.roleName}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Type<span className="star">*</span></ControlLabel>
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
          <Button bsStyle="success" fill onClick={this.onClickAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

AddRolesModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddRolesModal
