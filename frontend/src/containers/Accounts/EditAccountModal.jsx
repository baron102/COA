import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import {Input, FormFeedback} from "reactstrap";
import PropTypes from "prop-types";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class EditAccountModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      accountID: this.props.selectedAccount.account_id,
      description: this.props.selectedAccount.description,
      info: this.props.selectedAccount.info,
      accountType: this.props.selectedAccount.account_type,
      subType: this.props.selectedAccount.sub_type,
      activity: this.props.selectedAccount.activity,
      errors: {
        accountID: '',
        description: '',
        info: '',
        subType: '',
        activity: '',
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
    if (this.state.accountID === '') {
      errors.accountID = 'Account ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.description === '') {
      errors.description = 'Description is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Information is required.';
      this.setState({errors});
      return;
    }

    if (this.state.subType === '') {
      errors.subType = 'Account sub type is required.';
      this.setState({errors});
      return;
    }

    if (this.state.activity === '') {
      errors.activity = 'Activity is required.';
      this.setState({errors});
      return;
    }

    ApiHelper.put(`/api/accounts/${this.props.selectedAccount.id}/`, {
      account_id: this.state.accountID,
      description: this.state.description,
      info: this.state.info,
      account_type: this.state.accountType,
      sub_type: this.state.subType,
      activity: this.state.activity,
    }).then(res => {
      toastr.success('Success!', 'Account was successfully updated.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to update Account.');
    });
  };

  render() {
    const {
      errors,
      accountID,
      description,
      info,
      accountType,
      subType,
      activity,
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
          <Modal.Title>Edit Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Account ID" type="text" name="accountID" value={accountID}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.accountID}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Description<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Description" type="text" name="description" value={description}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.description}</FormFeedback>
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
                <Input type="select" className="browser-default custom-select" name="accountType" value={accountType}
                        onChange={this.handleChangeInput} style={{fontSize: 16, marginTop:10}}>
                  <option value={'Asset'}>Asset</option>
                  <option value={'Liability'}>Liability</option>
                  <option value={'Capital'}>Capital</option>
                  <option value={'Income'}>Income</option>
                  <option value={'COGS'}>COGS</option>
                  <option value={'Expenses'}>Expenses</option>
                  <option value={'Other Income'}>Other Income</option>
                  <option value={'Other'}>Other</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Sub Type<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Sub Type" type="text" name="subType" value={subType}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.subType}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Activity<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Activity" type="text" name="activity" value={activity}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.activity}</FormFeedback>
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

EditAccountModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedAccount: PropTypes.object
};

export default EditAccountModal
