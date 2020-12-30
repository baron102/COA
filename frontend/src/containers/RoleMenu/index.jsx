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
import AddRoleMenuModal from "./AddRoleMenuModal";
import EditRoleMenuModal from "./EditRoleMenuModal";

class RoleMenuTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role_menus: [],
      selectedID: null,
      showAddRoleMenuModal: false,
      showEditRoleMenuModal: false,
    };
  }

  componentWillMount() {
    this.getRoleMenus();
  }

  getRoleMenus() {
    ApiHelper.get('/api/role_menu/')
      .then(res => {
        this.setState({role_menus: res.data});
      });
  }

  showAddRoleMenuModal = () =>{
    this.setState({showAddRoleMenuModal: true
    })
  };

  hideAddRoleMenuModal = () =>{
    this.setState({showAddRoleMenuModal: false
    })
  };

  onAddRoleMenu = role_menu => {
    let role_menus = this.state.role_menus;
    role_menus.push(role_menu);
    this.setState({role_menus});
    this.hideAddRoleMenuModal();
  };

  onEditRoleMenu = role_menu => {
    let role_menus = this.state.role_menus;
    let index = role_menus.findIndex(item => item.id === role_menu.id);
    role_menus[index] = role_menu;
    this.setState({role_menus});
    this.hideEditRoleMenuModal();
  };

  openEditRoleMenuModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedID: row,
      showEditRoleMenuModal: true
    });
  };

  hideEditRoleMenuModal = () => {
    this.setState({
      selectedID: null,
      showEditRoleMenuModal: false
    });
  };

  deleteRoleMenu = (e, role_menu) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this Role Menu?', {
      title: 'Delete Role Menu'
    }).then(() => {
      ApiHelper.delete(`/api/role_menu/${role_menu}/`)
        .then(res => {
          let role_menus = this.state.role_menus;
          let index = role_menus.findIndex(item => item.id === role_menu);
          role_menus.splice(index, 1);
          this.setState({role_menus});
          toastr.success('Success!', 'Role Menu was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Role Menu.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditRoleMenuModal,
      selectedID
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Role Menu</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Role Menu</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditRoleMenuModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditRoleMenuModal &&
          selectedID.id === row.original.id &&
          <EditRoleMenuModal
            show={showEditRoleMenuModal}
            onHide={this.hideEditRoleMenuModal}
            onSubmit={this.onEditRoleMenu}
            selectedID={selectedID}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteRoleMenu(e, row.original.id)
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
      role_menus,
      showAddRoleMenuModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddRoleMenuModal}>Add Role Menu</button>
              {
                showAddRoleMenuModal &&
                <AddRoleMenuModal
                    {...this.props}
                    show={showAddRoleMenuModal}
                    onHide={this.hideAddRoleMenuModal}
                    onSubmit={this.onAddRoleMenu}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Role Menus"
                content={
                  <ReactTable
                    data={role_menus}
                    columns={[
                      {
                        Header: "Role Name",
                        accessor: "role_name",
                        sortable: true,
                      },
                      {
                        Header: "Menu ID",
                        accessor: "menu_id",
                      },
                      {
                        Header: "Info",
                        accessor: "info",
                      },
                      {
                        Header: "Title",
                        accessor: "title",
                      },
                      {
                        Header: "Type",
                        accessor: "type",
                      },
                      {
                        Header: "Value",
                        accessor: "value",
                      },
                      {
                        Header: "Location",
                        accessor: "location",
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
                    noDataText="No Role Menu Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(RoleMenuTables);
