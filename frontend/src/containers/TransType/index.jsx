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
import AddTransTypeModal from "./AddTransTypeModal";
import EditTransTypeModal from "./EditTransTypeModal";

class TransTypeTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [],
      selectedType: null,
      showAddTypeModal: false,
      showEditTypeModal: false,
    };
  }

  componentWillMount() {
    this.getTypes();
  }

  getTypes() {
    ApiHelper.get('/api/trans-types/')
      .then(res => {
        this.setState({types: res.data});
      });
  }

  showAddTypeModal = () =>{
    this.setState({showAddTypeModal: true
    })
  };

  hideAddTypeModal = () =>{
    this.setState({showAddTypeModal: false
    })
  };

  onAddType = type => {
    let types = this.state.types;
    types.push(type);
    this.setState({types});
    this.hideAddTypeModal();
  };

  onEditType = type => {
    let types = this.state.types;
    let index = types.findIndex(item => item.id === type.id);
    types[index] = type;
    this.setState({types});
    this.hideEditTypeModal();
  };

  openEditTypeModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedType: row,
      showEditTypeModal: true
    });
  };

  hideEditTypeModal = () => {
    this.setState({
      selectedType: null,
      showEditTypeModal: false
    });
  };

  deleteType = (e, typeID) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this Trans Type?', {
      title: 'Delete Trans Type'
    }).then(() => {
      ApiHelper.delete(`/api/trans-types/${typeID}/`)
        .then(res => {
          let types = this.state.types;
          let index = types.findIndex(item => item.id === typeID);
          types.splice(index, 1);
          this.setState({types});
          toastr.success('Success!', 'Trans Type was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Trans Type.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditTypeModal,
      selectedType
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Trans Type</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Trans Type</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditTypeModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditTypeModal &&
          selectedType.id === row.original.id &&
          <EditTransTypeModal
            show={showEditTypeModal}
            onHide={this.hideEditTypeModal}
            onSubmit={this.onEditType}
            selectedType={selectedType}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteType(e, row.original.id)
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
      types,
      showAddTypeModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddTypeModal}>Add Trans Type</button>
              {
                showAddTypeModal &&
                <AddTransTypeModal
                    {...this.props}
                    show={showAddTypeModal}
                    onHide={this.hideAddTypeModal}
                    onSubmit={this.onAddType}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Trans Types"
                content={
                  <ReactTable
                    data={types}
                    columns={[
                      {
                        Header: "TYPE",
                        accessor: "type",
                        sortable: true,
                      },
                      {
                        Header: "FINANCIAL",
                        accessor: "financial",
                      },
                      {
                        Header: "JOURNAL",
                        accessor: "journals",
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
                    noDataText="No Types Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(TransTypeTables);
