import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal, DropdownButton} from "react-bootstrap"
import {Input, FormFeedback } from "reactstrap"
import PropTypes from "prop-types";
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class AddItemCountsModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      item_id: '',
      count_type: '',
      plan_total: '',
      plan_rows: '',
      plan_year: '',
      info: '',
      errors: {
        item_id: '',
        count_type: '',
        plan_total: '',
        plan_rows: '',
        plan_year: '',
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

  onClickAdd = () => {
    let errors = this.state.errors;
    if (this.state.item_id === '') {
      errors.item_id = 'Item ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.count_type === '') {
      errors.count_type = 'Count Type is required.';
      this.setState({errors});
      return;
    }

    if (this.state.plan_total === '') {
      errors.plan_total = 'Plan Total is required.';
      this.setState({errors});
      return;
    }

    if (this.state.plan_rows === '') {
      errors.plan_rows = 'Plan Rows is required.';
      this.setState({errors});
      return;
    }

    if (this.state.plan_year === '') {
      errors.plan_year = 'Plan Year is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Information is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.post('/api/item_counts/', {
      item_id: this.state.item_id,
      count_type: this.state.count_type,
      info: this.state.info,
      plan_total: this.state.plan_total,
      plan_rows: this.state.plan_rows,
      plan_year: this.state.plan_year,
    }).then(res => {
      toastr.success('Success!', 'Item Count was successfully added.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to add Item Count.');
    });
  };

  render() {
    const {
      errors,
      item_id,
      count_type,
      plan_total,
      plan_rows,
      plan_year,
      info
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
          <Modal.Title>Add Item Count</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">Item ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Item ID" type="text" name="item_id" value={item_id}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.item_id}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Count Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Count Type" type="text" name="count_type" value={count_type}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.count_type}</FormFeedback>
              </Col>
            </FormGroup>            
            <FormGroup>
              <ControlLabel className="col-md-3">Plan Total<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Plan Total" type="text" name="plan_total" value={plan_total}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.plan_total}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Plan Rows<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Plan Rows" type="text" name="plan_rows" value={plan_rows}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.plan_rows}</FormFeedback>
              </Col>
            </FormGroup>            
            <FormGroup>
              <ControlLabel className="col-md-3">Plan Year<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Plan Year" type="text" name="plan_year" value={plan_year}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.plan_year}</FormFeedback>
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

AddItemCountsModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddItemCountsModal
