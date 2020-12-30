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
import AddModelModal from "./AddModelModal";
import EditModelModal from "./EditModelModal";

class ModelTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      models: [],
      selectedModel: null,
      showAddModelModal: false,
      showEditModelModal: false,
    };
  }

  componentWillMount() {
    this.getEntities();
  }

  getEntities() {
    ApiHelper.get('/api/models/')
      .then(res => {
        this.setState({models: res.data});
      });
  }

  showAddModelModal = () =>{
    this.setState({showAddModelModal: true
    })
  };

  hideAddModelModal = () =>{
    this.setState({showAddModelModal: false
    })
  };

  onAddModel = model => {
    let models = this.state.models;
    models.push(model);
    this.setState({models});
    this.hideAddModelModal();
  };

  onEditModel = model => {
    let models = this.state.models;
    let index = models.findIndex(item => item.id === model.id);
    models[index] = model;
    this.setState({models});
    this.hideEditModelModal();
  };

  openEditModelModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedModel: row,
      showEditModelModal: true
    });
  };

  hideEditModelModal = () => {
    this.setState({
      selectedModel: null,
      showEditModelModal: false
    });
  };

  deleteModel = (e, modelID) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this model?', {
      title: 'Delete Model'
    }).then(() => {
      ApiHelper.delete(`/api/models/${modelID}/`)
        .then(res => {
          let models = this.state.models;
          let index = models.findIndex(item => item.id === modelID);
          models.splice(index, 1);
          this.setState({models});
          toastr.success('Success!', 'Model was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Model.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditModelModal,
      selectedModel
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Model</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Model</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditModelModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditModelModal &&
          selectedModel.id === row.original.id &&
          <EditModelModal
            show={showEditModelModal}
            onHide={this.hideEditModelModal}
            onSubmit={this.onEditModel}
            selectedModel={selectedModel}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteModel(e, row.original.id)
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
      models,
      showAddModelModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddModelModal}>Add Model</button>
              {
                showAddModelModal &&
                <AddModelModal
                    {...this.props}
                    show={showAddModelModal}
                    onHide={this.hideAddModelModal}
                    onSubmit={this.onAddModel}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Models"
                content={
                  <ReactTable
                    data={models}
                    columns={[
                      {
                        Header: "NAME",
                        accessor: "model_name",
                        sortable: true,
                      },
                      {
                        Header: "STATUS",
                        accessor: "status",
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
                    noDataText="No Models Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(ModelTables);
