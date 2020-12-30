import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal, DropdownButton} from "react-bootstrap"
import {Input, FormFeedback } from "reactstrap"
import PropTypes from "prop-types";
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class AddIdModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      idName: '',
      idType: 'Entity',
      idInfo: '',
      multipleSelect: null,
      status: 'Active',
      errors: {
        idName: '',
        idInfo: '',
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
    if (this.state.idName === '') {
      errors.idName = 'ID name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.idInfo === '') {
      errors.idInfo = 'ID info is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/id/', {
      id_name: this.state.idName,
      id_type: this.state.idType,
      id_role: this.state.multipleSelect,
      id_info: this.state.idInfo,
      status: this.state.status,
    }).then(res => {
      toastr.success('Success!', 'ID was successfully added.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to add ID.');
    });
  };

  render() {
    const {
      errors,
      idName,
      idType,
      idInfo,
      status,
      multipleSelect
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
          <Modal.Title>Add ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">Name<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="ID Name" type="text" name="idName" value={idName}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.idName}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <Input type="select" className="browser-default custom-select" name="idType" value={idType}
                        onChange={this.handleChangeInput} style={{fontSize: 16, marginTop:10}}>
                  <option value={'Entity'}>Entity</option>
                  <option value={'Individual'}>Individual</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Status<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <Input type="select" className="browser-default custom-select" name="status" value={status}
                        onChange={this.handleChangeInput} style={{fontSize: 16, marginTop:10}}>
                  <option value={'Active'}>Active</option>
                  <option value={'Deleted'}>Deleted</option>
                  <option value={'OnHold'}>OnHold</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Roles<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <Select
                  className="react-select info"
                  classNamePrefix="react-select"
                  placeholder="Choose Roles"
                  name="multipleSelect"
                  closeMenuOnSelect={false}
                  isMulti
                  value={multipleSelect}
                  onChange={
                    value =>
                    this.setState({ multipleSelect: value })
                  }
                  options={[
                    {
                      value: "",
                      label: " Multiple Options",
                      isDisabled: true
                    },
                    { value: "2", label: "Customer" },
                    { value: "3", label: "Vendor" },
                    { value: "4", label: "Lead" },
                    { value: "5", label: "Contact" },
                    { value: "6", label: "Employee" },
                    { value: "7", label: "Contractor" },
                  ]}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Info<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl rows="5" componentClass="textarea" placeholder="Info" name="idInfo" value={idInfo}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.idInfo}</FormFeedback>
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

AddIdModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddIdModal
