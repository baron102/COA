import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal, DropdownButton} from "react-bootstrap"
import {Input, FormFeedback } from "reactstrap"
import PropTypes from "prop-types";
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class AddItemTransModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      trans_id: '',
      item_id: '',
      tran_date: '',
      trans_user: '',
      trans_type: '',
      entity: '',
      reference: '',
      quantity: '',
      warehouse: '',
      location: '',
      bin: '',
      revenue: '',
      cost: '',
      notes: '',
      errors: {
        trans_id: '',
        item_id: '',
        tran_date: '',
        trans_user: '',
        trans_type: '',
        entity: '',
        reference: '',
        quantity: '',
        warehouse: '',
        location: '',
        bin: '',
        revenue: '',
        cost: '',
        notes: '',
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
    if (this.state.trans_id === '') {
      errors.trans_id = 'Trans ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.item_id === '') {
      errors.item_id = 'Item ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.tran_date === '') {
      errors.tran_date = 'Trans Date is required.';
      this.setState({errors});
      return;
    }

    if (this.state.trans_user === '') {
      errors.trans_user = 'Trans User is required.';
      this.setState({errors});
      return;
    }

    if (this.state.trans_type === '') {
      errors.trans_type = 'Trans Type is required.';
      this.setState({errors});
      return;
    }

    if (this.state.entity === '') {
      errors.entity = 'Entity is required.';
      this.setState({errors});
      return;
    }

    if (this.state.reference === '') {
      errors.reference = 'Reference is required.';
      this.setState({errors});
      return;
    }

    if (this.state.quantity === '') {
      errors.quantity = 'Quantity is required.';
      this.setState({errors});
      return;
    }

    if (this.state.warehouse === '') {
      errors.warehouse = 'Warehouse is required.';
      this.setState({errors});
      return;
    }

    if (this.state.location === '') {
      errors.location = 'Location is required.';
      this.setState({errors});
      return;
    }

    if (this.state.bin === '') {
      errors.bin = 'Bin is required.';
      this.setState({errors});
      return;
    }

    if (this.state.revenue === '') {
      errors.revenue = 'Revenue is required.';
      this.setState({errors});
      return;
    }

    if (this.state.cost === '') {
      errors.cost = 'Cost is required.';
      this.setState({errors});
      return;
    }

    if (this.state.notes === '') {
      errors.notes = 'Notes is required.';
      this.setState({errors});
      return;
    }    

    ApiHelper.post('/api/item_trans/', {
      trans_id: this.state.trans_id,
      item_id: this.state.item_id,
      tran_date: this.state.tran_date,
      trans_user: this.state.trans_user,
      trans_type: this.state.trans_type,
      entity: this.state.entity,
      reference: this.state.reference,
      quantity: this.state.quantity,
      warehouse: this.state.warehouse,
      location: this.state.location,
      bin: this.state.bin,
      revenue: this.state.revenue,
      cost: this.state.cost,
      notes: this.state.notes,
    }).then(res => {
      toastr.success('Success!', 'Trans Item was successfully added.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to add Trans Item.');
    });
  };

  render() {
    const {
      errors,
      trans_id,
      item_id,
      tran_date,
      trans_user,
      trans_type,
      entity,
      reference,
      quantity,
      warehouse,
      location,
      bin,
      revenue,
      cost,
      notes
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
          <Modal.Title>Add Trans ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">Trans ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans ID" type="text" name="trans_id" value={trans_id}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.trans_id}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Item ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Item ID" type="text" name="item_id" value={item_id}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.item_id}</FormFeedback>
              </Col>
            </FormGroup>            
            <FormGroup>
              <ControlLabel className="col-md-3">Trans Date<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Date" type="text" name="tran_date" value={tran_date}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.tran_date}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Trans User<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans User" type="text" name="trans_user" value={trans_user}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.trans_user}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Trans Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Type" type="text" name="trans_type" value={trans_type}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.trans_type}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Entity<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Entity" type="text" name="entity" value={entity}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.entity}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Reference<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Reference" type="text" name="reference" value={reference}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.reference}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Quantity<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Quantity" type="text" name="quantity" value={quantity}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.quantity}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Warehouse<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl rows="5" componentClass="textarea" placeholder="Warehouse" name="warehouse" value={warehouse}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.warehouse}</FormFeedback>
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
            <FormGroup>
              <ControlLabel className="col-md-3">Bin<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Bin" type="text" name="bin" value={bin}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.bin}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Revenue<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Revenue" type="text" name="revenue" value={revenue}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.revenue}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Cost<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Cost" type="text" name="cost" value={cost}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.cost}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Notes<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Notes" type="text" name="notes" value={notes}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.notes}</FormFeedback>
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

AddItemTransModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddItemTransModal
