import React, {Component} from "react"
import { Form, ControlLabel, Col, FormControl, FormGroup, Modal} from "react-bootstrap"
import {toastr} from "react-redux-toastr";
import Button from "../../components/CustomButton/CustomButton";
import {Input, FormFeedback} from "reactstrap";
import PropTypes from "prop-types";
import ApiHelper from '../../helpers/apiHelper.jsx';
import Select from "react-select";

class EditJournalModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      journalID: this.props.selectedJournal.journal_id,
      journalName: this.props.selectedJournal.journal_name,
      info: this.props.selectedJournal.info,
      availableEntities: this.props.selectedJournal.avail_entities,
      errors: {
        journalID: '',
        journalName: '',
        info: '',
        availableEntities: '',
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

    if (this.state.journalID === '') {
      errors.journalID = 'Journal ID is required.';
      this.setState({errors});
      return;
    }

    if (this.state.journalName === '') {
      errors.journalName = 'Journal Name is required.';
      this.setState({errors});
      return;
    }

    if (this.state.info === '') {
      errors.info = 'Journal information is required.';
      this.setState({errors});
      return;
    }

    if (this.state.availableEntities === '') {
      errors.availableEntities = 'Available Entities are required.';
      this.setState({errors});
      return;
    }

    ApiHelper.put(`/api/journals/${this.props.selectedJournal.id}/`, {
      journal_id: this.state.journalID,
      journal_name: this.state.journalName,
      info: this.state.info,
      avail_entities: this.state.availableEntities,
    }).then(res => {
      toastr.success('Success!', 'Journal was successfully updated.');
      this.props.onSubmit(res.data);
    }).catch(err => {
      console.error(err);
      for(let key in err.response.data.errors) {
        errors[key] = err.response.data.errors[key];
        this.setState({errors});
      }
      toastr.error('Fail!', 'Failed to update Journal.');
    });
  };

  render() {
    console.log(this.props.selectedID)
    const {
      errors,
      journalID,
      journalName,
      info,
      availableEntities
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
          <Modal.Title>Edit Journal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <ControlLabel className="col-md-3">ID<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Journal ID" type="text" name="journalID" value={journalID}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.journalID}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Name<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Journal Name" type="text" name="journalName" value={journalName}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.journalName}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Info<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl rows={5} componentClass="textarea" placeholder="Journal Information" type="text" name="info" value={info}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.info}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup>
              <ControlLabel className="col-md-3">Available Entities<span className="star">*</span></ControlLabel>
              <Col md={9}>
                <FormControl placeholder="Available Entities" type="text" name="availableEntities" value={availableEntities}
                     onChange={this.handleChangeInput}/>
                <FormFeedback className="text-danger">{errors.availableEntities}</FormFeedback>
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

EditJournalModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedJournal: PropTypes.object
};

export default EditJournalModal
