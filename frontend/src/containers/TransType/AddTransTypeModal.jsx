import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal, DropdownButton} from "react-bootstrap"
import {Input, FormFeedback } from "reactstrap"
import PropTypes from "prop-types";
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class AddTransTypeModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      financial: 'YES',
      journals: '',
      info: '',
      errors: {
        type: '',
        financial: '',
        info: '',
        journals: ''
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
    if (this.state.type === '') {
      errors.type = 'Trans Type is required.';
      this.setState({errors});
      return;
    }

    if (this.state.journals === '') {
      errors.journals = 'Journal is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Information is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/trans-types/', {
      type: this.state.type,
      financial: this.state.financial,
      info: this.state.info,
      journals: this.state.journals,
    }).then(res => {
      toastr.success('Success!', 'Trans Type was successfully added.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to add Trans Type.');
    });
  };

  render() {
    const {
      errors,
      type,
      financial,
      info,
      journals
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
          <Modal.Title>Add Trans Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Type" type="text" name="type" value={type}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.type}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Financial<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <Input type="select" className="browser-default custom-select" name="financial" value={financial}
                        onChange={this.handleChangeInput} style={{fontSize: 16, marginTop:10}}>
                  <option value={'YES'}>YES</option>
                  <option value={'NO'}>NO</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Journal<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Journals" type="text" name="journals" value={journals}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.journals}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Info<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl componentClass="textarea" rows={5} placeholder="Information" name="info" value={info}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.info}</FormFeedback>
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

AddTransTypeModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddTransTypeModal
