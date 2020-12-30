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
import AddTransIDModal from "./AddTransIDModal";
import EditTransIDModal from "./EditTransIDModal";

class TransIDTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transIDs: [],
      selectedID: null,
      showAddTransIDModal: false,
      showEditTransIDModal: false,
    };
  }

  componentWillMount() {
    this.getTransIDs();
  }

  getTransIDs() {
    ApiHelper.get('/api/trans-ids/')
      .then(res => {
        this.setState({transIDs: res.data});
      });
  }

  showAddTransIDModal = () =>{
    this.setState({showAddTransIDModal: true
    })
  };

  hideAddTransIDModal = () =>{
    this.setState({showAddTransIDModal: false
    })
  };

  onAddTransID = transID => {
    let transIDs = this.state.transIDs;
    transIDs.push(transID);
    this.setState({transIDs});
    this.hideAddTransIDModal();
  };

  onEditTransID = transID => {
    let transIDs = this.state.transIDs;
    let index = transIDs.findIndex(item => item.id === transID.id);
    transIDs[index] = transID;
    this.setState({transIDs});
    this.hideEditTransIDModal();
  };

  openEditTransIDModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedID: row,
      showEditTransIDModal: true
    });
  };

  hideEditTransIDModal = () => {
    this.setState({
      selectedID: null,
      showEditTransIDModal: false
    });
  };

  deleteTransID = (e, transID) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this trans ID?', {
      title: 'Delete trans ID'
    }).then(() => {
      ApiHelper.delete(`/api/trans-ids/${transID}/`)
        .then(res => {
          let transIDs = this.state.transIDs;
          let index = transIDs.findIndex(item => item.id === transID);
          transIDs.splice(index, 1);
          this.setState({transIDs});
          toastr.success('Success!', 'Trans ID was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Trans ID.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditTransIDModal,
      selectedID
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Trans ID</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Trans ID</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditTransIDModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditTransIDModal &&
          selectedID.id === row.original.id &&
          <EditTransIDModal
            show={showEditTransIDModal}
            onHide={this.hideEditTransIDModal}
            onSubmit={this.onEditTransID}
            selectedID={selectedID}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteTransID(e, row.original.id)
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
      transIDs,
      showAddTransIDModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddTransIDModal}>Add Trans ID</button>
              {
                showAddTransIDModal &&
                <AddTransIDModal
                    {...this.props}
                    show={showAddTransIDModal}
                    onHide={this.hideAddTransIDModal}
                    onSubmit={this.onAddTransID}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Trans IDs"
                content={
                  <ReactTable
                    data={transIDs}
                    columns={[
                      {
                        Header: "ID",
                        accessor: "trans_num",
                        sortable: true,
                      },
                      {
                        Header: "USER",
                        accessor: "trans_user",
                      },
                      {
                        Header: "TYPE",
                        accessor: "type",
                      },
                      {
                        Header: "ENTITY",
                        accessor: "entity",
                      },
                      {
                        Header: "REFERENCE",
                        accessor: "reference",
                      },
                      {
                        Header: "VERSION",
                        accessor: "version",
                      },
                      {
                        Header: "STATUS",
                        accessor: "status",
                      },
                      {
                        Header: "AMOUNT",
                        accessor: "amount",
                      },
                      {
                        Header: "INFO",
                        accessor: "info",
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
                    noDataText="No Trans ID Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(TransIDTables);
