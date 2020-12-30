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
import AddAppDataSetsModal from "./AddAppDataSetsModal";
import EditAppDataSetsModal from "./EditAppDataSetsModal";

class AppDataSetsTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app_data_sets: [],
      selectedID: null,
      showAddAppDataSetsModal: false,
      showEditAppDataSetsModal: false,
    };
  }

  componentWillMount() {
    this.getAppDataSetss();
  }

  getAppDataSetss() {
    ApiHelper.get('/api/app_data_sets/')
      .then(res => {
        this.setState({app_data_sets: res.data});
      });
  }

  showAddAppDataSetsModal = () =>{
    this.setState({showAddAppDataSetsModal: true
    })
  };

  hideAddAppDataSetsModal = () =>{
    this.setState({showAddAppDataSetsModal: false
    })
  };

  onAddAppDataSets = app_data_set => {
    let app_data_sets = this.state.app_data_sets;
    app_data_sets.push(app_data_set);
    this.setState({app_data_sets});
    this.hideAddAppDataSetsModal();
  };

  onEditAppDataSets = app_data_set => {
    let app_data_sets = this.state.app_data_sets;
    let index = app_data_sets.findIndex(item => item.id === app_data_set.id);
    app_data_sets[index] = app_data_set;
    this.setState({app_data_sets});
    this.hideEditAppDataSetsModal();
  };

  openEditAppDataSetsModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedID: row,
      showEditAppDataSetsModal: true
    });
  };

  hideEditAppDataSetsModal = () => {
    this.setState({
      selectedID: null,
      showEditAppDataSetsModal: false
    });
  };

  deleteAppDataSets = (e, app_data_set) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this App Data Set?', {
      title: 'Delete App Data Set'
    }).then(() => {
      ApiHelper.delete(`/api/app_data_sets/${app_data_set}/`)
        .then(res => {
          let app_data_sets = this.state.app_data_sets;
          let index = app_data_sets.findIndex(item => item.id === app_data_set);
          app_data_sets.splice(index, 1);
          this.setState({app_data_sets});
          toastr.success('Success!', 'App Data Set was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete App Data Set.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditAppDataSetsModal,
      selectedID
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit App Data Set</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete App Data Set</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditAppDataSetsModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditAppDataSetsModal &&
          selectedID.id === row.original.id &&
          <EditAppDataSetsModal
            show={showEditAppDataSetsModal}
            onHide={this.hideEditAppDataSetsModal}
            onSubmit={this.onEditAppDataSets}
            selectedID={selectedID}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteAppDataSets(e, row.original.id)
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
      app_data_sets,
      showAddAppDataSetsModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddAppDataSetsModal}>Add App Data Set</button>
              {
                showAddAppDataSetsModal &&
                <AddAppDataSetsModal
                    {...this.props}
                    show={showAddAppDataSetsModal}
                    onHide={this.hideAddAppDataSetsModal}
                    onSubmit={this.onAddAppDataSets}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "App Data Sets"
                content={
                  <ReactTable
                    data={app_data_sets}
                    columns={[
                      {
                        Header: "MenuID",
                        accessor: "app_data_set_id",
                        sortable: true,
                      },
                      {
                        Header: "Description",
                        accessor: "app_data_set_description",
                      },
                      {
                        Header: "Status",
                        accessor: "app_data_set_status",
                      },
                      {
                        Header: "Info",
                        accessor: "app_data_set_info",
                      },
                      {
                        Header: "ContainerPOD",
                        accessor: "app_data_set_container_POD",
                      },
                      {
                        Header: "HelpText",
                        accessor: "app_data_set_help_text",
                      },
                      {
                        Header: "LastUsed",
                        accessor: "app_data_set_last_used",
                      },
                      {
                        Header: "UsageCount",
                        accessor: "app_data_set_usage_count",
                      },
                      {
                        Header: "RolesUsed",
                        accessor: "app_data_set_roles_used",
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
                    noDataText="No App Data Set Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(AppDataSetsTables);
