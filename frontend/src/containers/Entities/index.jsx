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
import AddEntityModal from "./AddEntityModal";
import EditEntityModal from "./EditEntityModal";

class EntityTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: [],
      selectedEntity: null,
      showAddEntityModal: false,
      showEditEntityModal: false,
    };
  }

  componentWillMount() {
    this.getEntities();
  }

  getEntities() {
    ApiHelper.get('/api/entities/')
      .then(res => {
        this.setState({entities: res.data});
      });
  }

  showAddEntityModal = () =>{
    this.setState({showAddEntityModal: true
    })
  };

  hideAddEntityModal = () =>{
    this.setState({showAddEntityModal: false
    })
  };

  onAddEntity = entity => {
    let entities = this.state.entities;
    entities.push(entity);
    this.setState({entities});
    this.hideAddEntityModal();
  };

  onEditEntity = entity => {
    let entities = this.state.entities;
    let index = entities.findIndex(item => item.id === entity.id);
    entities[index] = entity;
    this.setState({entities});
    this.hideEditEntityModal();
  };

  openEditEntityModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedEntity: row,
      showEditEntityModal: true
    });
  };

  hideEditEntityModal = () => {
    this.setState({
      selectedEntity: null,
      showEditEntityModal: false
    });
  };

  deleteEntity = (e, entityID) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this entity?', {
      title: 'Delete Entity'
    }).then(() => {
      ApiHelper.delete(`/api/entities/${entityID}/`)
        .then(res => {
          let entities = this.state.entities;
          let index = entities.findIndex(item => item.id === entityID);
          entities.splice(index, 1);
          this.setState({entities});
          toastr.success('Success!', 'Entity was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete ID.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditEntityModal,
      selectedEntity
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Entity</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Entity</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditEntityModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditEntityModal &&
          selectedEntity.id === row.original.id &&
          <EditEntityModal
            show={showEditEntityModal}
            onHide={this.hideEditEntityModal}
            onSubmit={this.onEditEntity}
            selectedEntity={selectedEntity}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteEntity(e, row.original.id)
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
      entities,
      showAddEntityModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddEntityModal}>Add Entity</button>
              {
                showAddEntityModal &&
                <AddEntityModal
                    {...this.props}
                    show={showAddEntityModal}
                    onHide={this.hideAddEntityModal}
                    onSubmit={this.onAddEntity}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Entities"
                content={
                  <ReactTable
                    data={entities}
                    columns={[
                      {
                        Header: "ID",
                        accessor: "entity_id",
                        sortable: true,
                      },
                      {
                        Header: "NAME",
                        accessor: "entity_name",
                        sortable: true,
                      },
                      {
                        Header: "TYPE",
                        accessor: "entity_type",
                        sortable: true
                      },
                      {
                        Header: "START DATE",
                        accessor: "date",
                        Cell: row => (
                          <span>{moment(row.original.start_date).format('YYYY-MM-DD')}</span>
                        )
                      },
                      {
                        Header: "END DATE",
                        accessor: "date",
                        Cell: row => (
                          <span>{moment(row.original.end_date).format('YYYY-MM-DD')}</span>
                        )
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
                    noDataText="No Entities Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(EntityTables);
