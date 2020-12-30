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
import AddContactAddressModal from "./AddContactAddressModal";
import EditContactAddressModal from "./EditContactAddressModal";

class ContactAddressTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactAddress: [],
      selectedContactAddress: null,
      showAddContactAddressModal: false,
      showEditContactAddressModal: false,
    };
  }

  componentWillMount() {
    this.getContactAddress();
  }

  getContactAddress() {
    ApiHelper.get('/api/contact-address/')
      .then(res => {
        this.setState({contactAddress: res.data});
      });
  }

  showAddContactAddressModal = () =>{
    this.setState({showAddContactAddressModal: true
    })
  };

  hideAddContactAddressModal = () =>{
    this.setState({showAddContactAddressModal: false
    })
  };

  onAddContactAddress = address => {
    let contactAddress = this.state.contactAddress;
    contactAddress.push(address);
    this.setState({contactAddress});
    this.hideAddContactAddressModal();
  };

  onEditContactAddress = address => {
    let contactAddress = this.state.contactAddress;
    let index = contactAddress.findIndex(item => item.id === address.id);
    contactAddress[index] = address;
    this.setState({contactAddress});
    this.hideEditContactAddressModal();
  };

  openEditContactAddressModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedContactAddress: row,
      showEditContactAddressModal: true
    });
  };

  hideEditContactAddressModal = () => {
    this.setState({
      selectedContactAddress: null,
      showEditContactAddressModal: false
    });
  };

  deleteContactAddress = (e, addressID) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this Contact Address?', {
      title: 'Delete Contact Address'
    }).then(() => {
      ApiHelper.delete(`/api/contact-address/${addressID}/`)
        .then(res => {
          let contactAddress = this.state.contactAddress;
          let index = contactAddress.findIndex(item => item.id === addressID);
          contactAddress.splice(index, 1);
          this.setState({contactAddress});
          toastr.success('Success!', 'Contact Address was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Contact Address.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditContactAddressModal,
      selectedContactAddress
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Contact Address</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Contact Address</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditContactAddressModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditContactAddressModal &&
          selectedContactAddress.id === row.original.id &&
          <EditContactAddressModal
            show={showEditContactAddressModal}
            onHide={this.hideEditContactAddressModal}
            onSubmit={this.onEditContactAddress}
            selectedContactAddress={selectedContactAddress}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteContactAddress(e, row.original.id)
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
      contactAddress,
      showAddContactAddressModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info" style={{fontSize:18}}
                      onClick={this.showAddContactAddressModal}>Add Contact Address</button>
              {
                showAddContactAddressModal &&
                <AddContactAddressModal
                    {...this.props}
                    show={showAddContactAddressModal}
                    onHide={this.hideAddContactAddressModal}
                    onSubmit={this.onAddContactAddress}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Contact Address"
                content={
                  <ReactTable
                    data={contactAddress}
                    columns={[
                      {
                        Header: "ID",
                        accessor: "contact_id",
                        sortable: true,
                      },
                      {
                        Header: "TYPE",
                        accessor: "type",
                        sortable: true,
                      },
                      {
                        Header: "Address1",
                        accessor: "address1",
                        sortable: true,
                      },
                      {
                        Header: "Address2",
                        accessor: "address2",
                      },
                      {
                        Header: "CITY",
                        accessor: "city",
                      },
                      {
                        Header: "STATE",
                        accessor: "state",
                      },
                      {
                        Header: "ZIP",
                        accessor: "zip",
                      },
                      {
                        Header: "LOCATION",
                        accessor: "location",
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
                    noDataText="No Contact Address Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactAddressTables);
