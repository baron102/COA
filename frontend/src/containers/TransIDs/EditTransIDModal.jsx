import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import {Input, FormFeedback} from "reactstrap";
import PropTypes from "prop-types";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class EditTransIDModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      transNum: this.props.selectedID.trans_num,
      transUser: this.props.selectedID.trans_user,
      type: this.props.selectedID.type,
      reference: this.props.selectedID.reference,
      version: this.props.selectedID.version,
      status: this.props.selectedID.status,
      amount: this.props.selectedID.amount,
      debit: this.props.selectedID.debit,
      credit: this.props.selectedID.credit,
      info: this.props.selectedID.info,
      entity: this.props.selectedID.entity,
      errors: {
        transNum: '',
        transUser: '',
        type: '',
        reference: '',
        version: '',
        status: '',
        amount: '',
        debit: '',
        credit: '',
        info: '',
        entity: '',
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
    if (this.state.transNum === '') {
      errors.transNum = 'Trans Number is required.';
      this.setState({errors});
      return;
    }

    if (this.state.transUser === '') {
      errors.transUser = 'Trans User is required.';
      this.setState({errors});
      return;
    }

    if (this.state.type === '') {
      errors.type = 'Type is required.';
      this.setState({errors});
      return;
    }

    if (this.state.reference === '') {
      errors.reference = 'Reference is required.';
      this.setState({errors});
      return;
    }

    if (this.state.version === '') {
      errors.version = 'Version is required.';
      this.setState({errors});
      return;
    }

    if (this.state.status === '') {
      errors.status = 'Status is required.';
      this.setState({errors});
      return;
    }

    if (this.state.amount === '') {
      errors.amount = 'Amount is required.';
      this.setState({errors});
      return;
    }

    if (this.state.debit === '') {
      errors.debit = 'Debit is required.';
      this.setState({errors});
      return;
    }

    if (this.state.credit === '') {
      errors.credit = 'Credit is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Information is required.';
      this.setState({errors});
      return;
    }

    if (this.state.entity === '') {
      errors.entity = 'Entity is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.put(`/api/trans-ids/${this.props.selectedID.id}/`, {
      trans_num: this.state.transNum,
      trans_user: this.state.transUser,
      info: this.state.info,
      type: this.state.type,
      reference: this.state.reference,
      version: this.state.version,
      amount: this.state.amount,
      credit: this.state.credit,
      debit: this.state.debit,
      entity: this.state.entity,
      status: this.state.status,
    }).then(res => {
      toastr.success('Success!', 'Trans ID was successfully updated.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to update Trans ID.');
    });
  };

  render() {
    const {
      errors,
      transNum,
      transUser,
      type,
      reference,
      version,
      status,
      amount,
      debit,
      credit,
      info,
      entity
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
          <Modal.Title>Edit Trans ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">Number<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Number" type="text" name="transNum" value={transNum}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.transNum}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">User<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans User" type="text" name="transUser" value={transUser}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.transUser}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Type" type="text" name="type" value={type}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.type}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Reference<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Reference" type="text" name="reference" value={reference}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.reference}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Version<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Version" type="text" name="version" value={version}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.version}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Amount<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Amount" type="text" name="amount" value={amount}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.amount}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Debit<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Debit" type="text" name="debit" value={debit}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.debit}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Credit<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Credit" type="text" name="credit" value={credit}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.credit}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Entity<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Entity" type="text" name="entity" value={entity}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.entity}</FormFeedback>
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
              <ControlLabel className="col-md-3">Status<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Trans Status" type="text" name="status" value={status}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.status}</FormFeedback>
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

EditTransIDModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedID: PropTypes.object
};

export default EditTransIDModal
