import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal, DropdownButton} from "react-bootstrap"
import {Input, FormFeedback } from "reactstrap"
import PropTypes from "prop-types";
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class AddAppDataSetsModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      table_name: '',
      related: '',
      record_count: '',
      info: '',
      errors: {
        table_name: '',
        related: '',
        record_count: '',
        info: ''
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
    if (this.state.table_name === '') {
      errors.table_name = 'Table Name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.related === '') {
      errors.related = 'Related is required.';
      this.setState({errors});
      return;
    }

    if (this.state.record_count === '') {
      errors.record_count = 'Record Count is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Information is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/app_data_sets/', {
      table_name: this.state.table_name,
      related: this.state.related,
      record_count: this.state.record_count,
      info: this.state.info,
    }).then(res => {
      toastr.success('Success!', 'App Data Set was successfully added.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to add App Data Set.');
    });
  };

  render() {
    const {
      errors,
      table_name,
      related,
      record_count,
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
          <Modal.Title>Add App Data Set</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">Table Name<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Table Name" type="text" name="table_name" value={table_name}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.table_name}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Related<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Related" type="text" name="related" value={related}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.related}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Record Count<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Record Count" type="text" name="record_count" value={record_count}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.record_count}</FormFeedback>
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
          <Button bsStyle="success" fill onClick={this.onClickAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

AddAppDataSetsModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddAppDataSetsModal
