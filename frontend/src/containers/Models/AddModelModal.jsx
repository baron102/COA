import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal, DropdownButton} from "react-bootstrap"
import {Input, FormFeedback } from "reactstrap"
import PropTypes from "prop-types";
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class AddModelModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      modelName: '',
      status: '',
      errors: {
        modelName: '',
        status: '',
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
  //
  // getIdRole = value => {
  //   console.log(value[0].label)
  // }

  onClickAdd = () => {
    let errors = this.state.errors;
    if (this.state.modelName === '') {
      errors.modelName = 'Model name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.status === '') {
      errors.status = 'Status is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/models/', {
      model_name: this.state.modelName,
      status: this.state.status,
    }).then(res => {
      toastr.success('Success!', 'Model was successfully added.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to add Model.');
    });
  };

  render() {
    const {
      errors,
      modelName,
      status,
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
          <Modal.Title>Add Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">Name<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Model Name" type="text" name="modelName" value={modelName}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.modelName}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Status<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Status" type="text" name="status" value={status}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.status}</FormFeedback>
                {/*<Input type="select" className="browser-default custom-select" name="idType" value={entityType}*/}
                {/*        onChange={this.handleChangeInput} style={{fontSize: 16, marginTop:10}}>*/}
                {/*  <option value={'Entity'}>Entity</option>*/}
                {/*  <option value={'Individual'}>Individual</option>*/}
                {/*</Input>*/}
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

AddModelModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddModelModal
