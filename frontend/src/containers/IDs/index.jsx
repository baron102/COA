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
import AddIdModal from "./AddIdModal.jsx";
import EditIdModal from "./EditIdModal"

class IDTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      selectedID: null,
      showAddIdModal: false,
      showEditIdModal: false,
    };
  }

  componentWillMount() {
    this.getIds();
  }

  getIds() {
    ApiHelper.get('/api/id/')
      .then(res => {
        this.setState({ids: res.data});
      });
  }

  showAddIdModal = () =>{
    this.setState({showAddIdModal: true
    })
  };

  hideAddIdModal = () =>{
    this.setState({showAddIdModal: false
    })
  };

  onAddId = user => {
    let ids = this.state.ids;
    ids.push(user);
    this.setState({ids});
    this.hideAddIdModal();
  };

  onEditId = user => {
    let ids = this.state.ids;
    let index = ids.findIndex(item => item.id === user.id);
    ids[index] = user;
    this.setState({ids});
    this.hideEditIdModal();
  };

  openEditIdModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedID: row,
      showEditIdModal: true
    });
  };

  hideEditIdModal = () => {
    this.setState({
      selectedID: null,
      showEditIdModal: false
    });
  };

  deleteId = (e, userID) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this ID?', {
      title: 'Delete ID'
    }).then(() => {
      ApiHelper.delete(`/api/id/${userID}/`)
        .then(res => {
          let ids = this.state.ids;
          let index = ids.findIndex(item => item.id === userID);
          ids.splice(index, 1);
          this.setState({ids});
          toastr.success('Success!', 'ID was successfully deleted.');
        }).catch(err => {
        toastr.error('Fail!', 'Failed to delete ID.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditIdModal,
      selectedID
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit ID</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete ID</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditIdModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditIdModal &&
          selectedID.id === row.original.id &&
          <EditIdModal
            show={showEditIdModal}
            onHide={this.hideEditIdModal}
            onSubmit={this.onEditId}
            selectedID={selectedID}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteId(e, row.original.id)
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
      ids,
      showAddIdModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddIdModal}>Add ID</button>
              {
                showAddIdModal &&
                <AddIdModal
                    {...this.props}
                    show={showAddIdModal}
                    onHide={this.hideAddIdModal}
                    onSubmit={this.onAddId}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "IDS"
                content={
                  <ReactTable
                    data={ids}
                    columns={[
                      {
                        Header: "NAME",
                        accessor: "id_name",
                        sortable: true,
                      },
                      {
                        Header: "TYPE",
                        accessor: "id_type",
                        sortable: true
                      },
                      {
                        Header: "ROLE",
                        accessor: "id_role",
                        sortable: false
                      },
                      {
                        Header: "ID ADDED",
                        accessor: "date",
                        Cell: row => (
                          <span>{moment(row.original.updated_at).format('YYYY-MM-DD')}</span>
                        )
                      },
                      {
                        Header: "STATUS",
                        accessor: "status",
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
                    noDataText="No IDs Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(IDTables);
