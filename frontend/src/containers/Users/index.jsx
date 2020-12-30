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
import AddUserModal from "./AddUserModal.jsx";
import EditUserModal from "./EditUserModal"

class UserTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      adminId: this.props.user.admin_id,
      selectedUser: null,
      showAddUserModal: false,
      showEditUserModal: false,
    };
  }

  componentWillMount() {
    this.getUsers();
  }

  getUsers() {
    ApiHelper.get('/api/users/')
      .then(res => {
        this.setState({users: res.data});
      });
  }

  showAddUserModal = () =>{
    this.setState({showAddUserModal: true
    })
  };

  hideAddUserModal = () =>{
    this.setState({showAddUserModal: false
    })
  };

  onAddUser = user => {
    let users = this.state.users;
    users.push(user);
    this.setState({users});
    this.hideAddUserModal();
  };

  onEditUser = user => {
    let users = this.state.users;
    let index = users.findIndex(item => item.id === user.id);
    users[index] = user;
    this.setState({users});
    this.hideEditUserModal();
  };

  openEditUserModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedUser: row,
      showEditUserModal: true
    });
  };

  hideEditUserModal = () => {
    this.setState({
      selectedUser: null,
      showEditUserModal: false
    });
  };

  deleteUser = (e, userID) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this user?', {
      title: 'Delete User'
    }).then(() => {
      ApiHelper.delete(`/api/users/${userID}/`)
        .then(res => {
          let users = this.state.users;
          let index = users.findIndex(item => item.id === userID);
          users.splice(index, 1);
          this.setState({users});
          toastr.success('Success!', 'User was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete user.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditUserModal,
      selectedUser
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit User</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete User</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditUserModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditUserModal &&
          selectedUser.id === row.original.id &&
          <EditUserModal
            show={showEditUserModal}
            onHide={this.hideEditUserModal}
            onSubmit={this.onEditUser}
            user={selectedUser}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteUser(e, row.original.id)
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
      users,
      showAddUserModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddUserModal}>Add User</button>
              {
                showAddUserModal &&
                <AddUserModal
                    {...this.props}
                    show={showAddUserModal}
                    onHide={this.hideAddUserModal}
                    onSubmit={this.onAddUser}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "USERS"
                content={
                  <ReactTable
                    data={users}
                    columns={[
                      {
                        Header: "USER NAME",
                        accessor: "full_name",
                        sortable: true,
                        Cell: row => (
                          <span>{row.original.first_name + " " + row.original.last_name}</span>
                        )
                      },
                      {
                        Header: "ROLE",
                        accessor: "user_role",
                        sortable: true
                      },
                      {
                        Header: "EMAIL",
                        accessor: "email",
                        sortable: false
                      },
                      {
                        Header: "PHONE NUMBER",
                        accessor: "phone_number",
                        sortable: false
                      },
                      {
                        Header: "USER ADDED",
                        accessor: "date",
                        Cell: row => (
                          <span>{moment(row.original.date_joined).format('YYYY-MM-DD')}</span>
                        )
                      },
                      {
                        Header: "STATUS",
                        accessor: "is_active",
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
                    noDataText="No Users Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(UserTables);
