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
import AddRolesModal from "./AddRolesModal";
import EditRolesModal from "./EditRolesModal";

class RolesTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Roles: [],
      selectedRoles: null,
      showAddRolesModal: false,
      showEditRolesModal: false,
    };
  }

  componentWillMount() {
    this.getRoles();
  }

  getRoles() {
    ApiHelper.get('/api/roles/')
      .then(res => {
        this.setState({Roles: res.data});
      });
  }

  showAddRolesModal = () =>{
    this.setState({showAddRolesModal: true
    })
  };

  hideAddRolesModal = () =>{
    this.setState({showAddRolesModal: false
    })
  };

  onAddRoles = role => {
    let Roles = this.state.Roles;
    Roles.push(role);
    this.setState({Roles});
    this.hideAddRolesModal();
  };

  onEditRoles = role => {
    let Roles = this.state.Roles;
    let index = Roles.findIndex(item => item.id === role.id);
    Roles[index] = role;
    this.setState({Roles});
    this.hideEditRolesModal();
  };

  openEditRolesModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedRoles: row,
      showEditRolesModal: true
    });
  };

  hideEditRolesModal = () => {
    this.setState({
      selectedRoles: null,
      showEditRolesModal: false
    });
  };

  deleteRoles = (e, roleName) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this Roles?', {
      title: 'Delete Roles'
    }).then(() => {
      ApiHelper.delete(`/api/roles/${roleName}/`)
        .then(res => {
          let Roles = this.state.Roles;
          let index = Roles.findIndex(item => item.id === roleName);
          Roles.splice(index, 1);
          this.setState({Roles});
          toastr.success('Success!', 'Role was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Role.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditRolesModal,
      selectedRoles
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Roles</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Roles</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditRolesModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditRolesModal &&
          selectedRoles.id === row.original.id &&
          <EditRolesModal
            show={showEditRolesModal}
            onHide={this.hideEditRolesModal}
            onSubmit={this.onEditRoles}
            selectedRoles={selectedRoles}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteRoles(e, row.original.id)
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
      Roles,
      showAddRolesModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info" style={{fontSize:18}}
                      onClick={this.showAddRolesModal}>Add Roles</button>
              {
                showAddRolesModal &&
                <AddRolesModal
                    {...this.props}
                    show={showAddRolesModal}
                    onHide={this.hideAddRolesModal}
                    onSubmit={this.onAddRoles}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Roles"
                content={
                  <ReactTable
                    data={Roles}
                    columns={[
                      {
                        Header: "RoleName",
                        accessor: "role_name",
                        sortable: true,
                      },
                      {
                        Header: "UserCount",
                        accessor: "user_count",
                        sortable: true,
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
                    noDataText="No Roles Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(RolesTables);
