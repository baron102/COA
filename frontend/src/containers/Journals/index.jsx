import React, { Component } from "react";
import ReactTable from "react-table";
import {connect} from "react-redux"
import {toastr} from "react-redux-toastr";
import moment from "moment";
import {Grid, Row, Col, Tooltip, OverlayTrigger} from "react-bootstrap";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import {confirm} from "../../helpers/commonHelper";
import {getUserInfo} from '../../redux/actions/auth.jsx';
import ApiHelper from "../../helpers/apiHelper.jsx";
import AddJournalModal from "./AddJournalModal";
import EditJournalModal from "./EditJournalModal";

class JournalTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      journals: [],
      selectedJournal: null,
      showAddJournalModal: false,
      showEditJournalModal: false,
    };
  }

  componentWillMount() {
    this.getJournals();
  }

  getJournals() {
    ApiHelper.get('/api/journals/')
      .then(res => {
        this.setState({entities: res.data});
      });
  }

  showAddJournalModal = () =>{
    this.setState({showAddJournalModal: true
    })
  };

  hideAddJournalModal = () =>{
    this.setState({showAddJournalModal: false
    })
  };

  onAddJournal = journal => {
    let journals = this.state.journals;
    journals.push(journal);
    this.setState({journals});
    this.hideAddJournalModal();
  };

  onEditJournal = journal => {
    let journals = this.state.journals;
    let index = journals.findIndex(item => item.id === journal.id);
    journals[index] = journal;
    this.setState({journals});
    this.hideEditJournalModal();
  };

  openEditJournalModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedJournal: row,
      showEditJournalModal: true
    });
  };

  hideEditJournalModal = () => {
    this.setState({
      selectedJournal: null,
      showEditJournalModal: false
    });
  };

  deleteJournal = (e, journalID) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this journal?', {
      title: 'Delete Journal'
    }).then(() => {
      ApiHelper.delete(`/api/journals/${journalID}/`)
        .then(res => {
          let journals = this.state.journals;
          let index = journals.findIndex(item => item.id === journalID);
          journals.splice(index, 1);
          this.setState({journals});
          toastr.success('Success!', 'Journal was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Journal.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditJournalModal,
      selectedJournal
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Journal</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Journal</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditJournalModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditJournalModal &&
          selectedJournal.id === row.original.id &&
          <EditJournalModal
            show={showEditJournalModal}
            onHide={this.hideEditJournalModal}
            onSubmit={this.onEditJournal}
            selectedJournal={selectedJournal}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteJournal(e, row.original.id)
            }
          >
            <i className="fa fa-trash fa-lg" />
          </Button>
        </OverlayTrigger>
      </div>
    )
  };

  render() {
    const {
      journals,
      showAddJournalModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddJournalModal}>Add Journal</button>
              {
                showAddJournalModal &&
                <AddJournalModal
                    {...this.props}
                    show={showAddJournalModal}
                    onHide={this.hideAddJournalModal}
                    onSubmit={this.onAddJournal}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Journals"
                content={
                  <ReactTable
                    data={journals}
                    columns={[
                      {
                        Header: "ID",
                        accessor: "journal_id",
                        sortable: true,
                      },
                      {
                        Header: "NAME",
                        accessor: "journal_name",
                        sortable: true,
                      },
                      {
                        Header: "Info",
                        accessor: "info",
                        sortable: true
                      },
                      {
                        Header: "Available Entities",
                        accessor: "aval_entities",
                        sortable: true
                      },
                      {
                        Header: "Actions",
                        accessor: "actions",
                        sortable: false,
                        filterable: false,
                        style: {
                          textAlign: "center"
                        },
                        Cell: this.renderCell
                      }
                    ]}
                    defaultPageSize={10}
                    showPaginationTop={false}
                    showPaginationBottom={true}
                    className="-striped -highlight"
                    noDataText="No Journals Found"
                  />
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = {
  getUserInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(JournalTables);
