import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal, DropdownButton} from "react-bootstrap"
import {Input, FormFeedback } from "reactstrap"
import PropTypes from "prop-types";
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class AddPlanModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      planID: '',
      planType: 'Budget',
      total: '',
      info: '',
      rows: '',
      year: '',
      errors: {
        planID: '',
        total: '',
        info: '',
        type: '',
        rows: '',
        year: '',
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
    if (this.state.planID === '') {
      errors.planID = 'Plan ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.total === '') {
      errors.total = 'Plan total is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Information is required.';
      this.setState({errors});
      return;
    }

    if (this.state.rows === '') {
      errors.rows = 'Plan rows are required.';
      this.setState({errors});
      return;
    }

    if (this.state.year === '') {
      errors.year = 'Plan year are required.';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/plans/', {
      plan_id: this.state.planID,
      total: this.state.total,
      info: this.state.info,
      type: this.state.planType,
      rows: this.state.rows,
      year: this.state.year,
    }).then(res => {
      toastr.success('Success!', 'Plan was successfully added.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to add Plan.');
    });
  };

  render() {
    const {
      errors,
      planID,
      planType,
      info,
      total,
      rows,
      year
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
          <Modal.Title>Add Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Plan ID" type="text" name="planID" value={planID}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.planID}</FormFeedback>
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
              <ControlLabel className="col-md-3">Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <Input type="select" className="browser-default custom-select" name="planType" value={planType}
                        onChange={this.handleChangeInput} style={{fontSize: 16, marginTop:10}}>
                  <option value={'Budget'}>Budget</option>
                  <option value={'Forecast'}>Forecast</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Total<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Plan Total" type="text" name="total" value={total}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.total}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Rows<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Plan Rows" type="text" name="rows" value={rows}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.rows}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Year<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Plan year" type="text" name="year" value={year}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.year}</FormFeedback>
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

AddPlanModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddPlanModal
