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
import AddAccountModal from "./AddAccountModal";
import EditAccountModal from "./EditAccountModal";

class AccountTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      selectedAccount: null,
      showAddAccountModal: false,
      showEditAccountModal: false,
    };
  }

  componentWillMount() {
    this.getAccounts();
  }

  getAccounts() {
    ApiHelper.get('/api/accounts/')
      .then(res => {
        this.setState({accounts: res.data});
      });
  }

  showAddAccountModal = () =>{
    this.setState({showAddAccountModal: true
    })
  };

  hideAddAccountModal = () =>{
    this.setState({showAddAccountModal: false
    })
  };

  onAddAccount = account => {
    let accounts = this.state.accounts;
    accounts.push(account);
    this.setState({accounts});
    this.hideAddAccountModal();
  };

  onEditAccount = account => {
    let accounts = this.state.accounts;
    let index = accounts.findIndex(item => item.id === account.id);
    accounts[index] = account;
    this.setState({accounts});
    this.hideEditAccountModal();
  };

  openEditAccountModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedAccount: row,
      showEditAccountModal: true
    });
  };

  hideEditAccountModal = () => {
    this.setState({
      selectedAccount: null,
      showEditAccountModal: false
    });
  };

  deleteAccount = (e, accountID) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this account?', {
      title: 'Delete Account'
    }).then(() => {
      ApiHelper.delete(`/api/accounts/${accountID}/`)
        .then(res => {
          let accounts = this.state.accounts;
          let index = accounts.findIndex(item => item.id === accountID);
          accounts.splice(index, 1);
          this.setState({accounts});
          toastr.success('Success!', 'Account was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Account.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditAccountModal,
      selectedAccount
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Account</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Account</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditAccountModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditAccountModal &&
          selectedAccount.id === row.original.id &&
          <EditAccountModal
            show={showEditAccountModal}
            onHide={this.hideEditAccountModal}
            onSubmit={this.onEditAccount}
            selectedAccount={selectedAccount}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteAccount(e, row.original.id)
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
      accounts,
      showAddAccountModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddAccountModal}>Add Account</button>
              {
                showAddAccountModal &&
                <AddAccountModal
                    {...this.props}
                    show={showAddAccountModal}
                    onHide={this.hideAddAccountModal}
                    onSubmit={this.onAddAccount}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Accounts"
                content={
                  <ReactTable
                    data={accounts}
                    columns={[
                      {
                        Header: "ID",
                        accessor: "account_id",
                        sortable: true,
                      },
                      {
                        Header: "DESCRIPTION",
                        accessor: "description",
                      },
                      {
                        Header: "INFO",
                        accessor: "info",
                      },
                      {
                        Header: "TYPE",
                        accessor: "account_type",
                      },
                      {
                        Header: "SUB TYPE",
                        accessor: "sub_type",
                      },
                      {
                        Header: "ACTIVITY",
                        accessor: "activity",
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
                    noDataText="No Accounts Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountTables);
