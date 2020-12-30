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
import AddUserRoleActionsModal from "./AddUserRoleActionsModal";
import EditUserRoleActionsModal from "./EditUserRoleActionsModal";

class UserRoleActionsTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserRoleActions: [],
      selectedUserRoleActions: null,
      showAddUserRoleActionsModal: false,
      showEditUserRoleActionsModal: false,
    };
  }

  componentWillMount() {
    this.getUserRoleActions();
  }

  getUserRoleActions() {
    ApiHelper.get('/api/user_role_actions/')
      .then(res => {
        this.setState({UserRoleActions: res.data});
      });
  }

  showAddUserRoleActionsModal = () =>{
    this.setState({showAddUserRoleActionsModal: true
    })
  };

  hideAddUserRoleActionsModal = () =>{
    this.setState({showAddUserRoleActionsModal: false
    })
  };

  onAddUserRoleActions = user_role_action => {
    let UserRoleActions = this.state.UserRoleActions;
    UserRoleActions.push(user_role_action);
    this.setState({UserRoleActions});
    this.hideAddUserRoleActionsModal();
  };

  onEditUserRoleActions = user_role_action => {
    let UserRoleActions = this.state.UserRoleActions;
    let index = UserRoleActions.findIndex(item => item.id === user_role_action.id);
    UserRoleActions[index] = user_role_action;
    this.setState({UserRoleActions});
    this.hideEditUserRoleActionsModal();
  };

  openEditUserRoleActionsModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedUserRoleActions: row,
      showEditUserRoleActionsModal: true
    });
  };

  hideEditUserRoleActionsModal = () => {
    this.setState({
      selectedUserRoleActions: null,
      showEditUserRoleActionsModal: false
    });
  };

  deleteUserRoleActions = (e, user_role_actions) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this UserRoleActions?', {
      title: 'Delete UserRoleActions'
    }).then(() => {
      ApiHelper.delete(`/api/user_role_actions/${user_role_actions}/`)
        .then(res => {
          let UserRoleActions = this.state.UserRoleActions;
          let index = UserRoleActions.findIndex(item => item.id === user_role_actions);
          UserRoleActions.splice(index, 1);
          this.setState({UserRoleActions});
          toastr.success('Success!', 'UserRoleAction was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete UserRoleAction.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditUserRoleActionsModal,
      selectedUserRoleActions
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit UserRoleActions</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete UserRoleActions</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditUserRoleActionsModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditUserRoleActionsModal &&
          selectedUserRoleActions.id === row.original.id &&
          <EditUserRoleActionsModal
            show={showEditUserRoleActionsModal}
            onHide={this.hideEditUserRoleActionsModal}
            onSubmit={this.onEditUserRoleActions}
            selectedUserRoleActions={selectedUserRoleActions}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteUserRoleActions(e, row.original.id)
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
      UserRoleActions,
      showAddUserRoleActionsModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info" style={{fontSize:18}}
                      onClick={this.showAddUserRoleActionsModal}>Add UserRoleActions</button>
              {
                showAddUserRoleActionsModal &&
                <AddUserRoleActionsModal
                    {...this.props}
                    show={showAddUserRoleActionsModal}
                    onHide={this.hideAddUserRoleActionsModal}
                    onSubmit={this.onAddUserRoleActions}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "UserRoleActions"
                content={
                  <ReactTable
                    data={UserRoleActions}
                    columns={[
                      {
                        Header: "User",
                        accessor: "user",
                        sortable: true,
                      },
                      {
                        Header: "Role",
                        accessor: "role",
                        sortable: true,
                      },
                      {
                        Header: "ActionsAllowed",
                        accessor: "actions_allowed",
                        sortable: true,
                      },
                      // {
                      //   Header: "Created",
                      //   accessor: "created_at",
                      //   sortable: true,
                      // },
                      // {
                      //   Header: "Updated",
                      //   accessor: "updated_at",
                      //   sortable: true,
                      // },
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
                    noDataText="No UserRoleActions Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(UserRoleActionsTables);
