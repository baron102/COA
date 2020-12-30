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
import AddContactInfoModal from "./AddContactInfoModal";
import EditContactInfoModal from "./EditContactInfoModal";

class ContactInfoTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactInfos: [],
      selectedContactInfo: null,
      showAddContactInfoModal: false,
      showEditContactInfoModal: false,
    };
  }

  componentWillMount() {
    this.getContactInfos();
  }

  getContactInfos() {
    ApiHelper.get('/api/contact-info/')
      .then(res => {
        this.setState({contactInfos: res.data});
      });
  }

  showAddContactInfoModal = () =>{
    this.setState({showAddContactInfoModal: true
    })
  };

  hideAddContactInfoModal = () =>{
    this.setState({showAddContactInfoModal: false
    })
  };

  onAddContactInfo = contactInfo => {
    let contactInfos = this.state.contactInfos;
    contactInfos.push(contactInfo);
    this.setState({contactInfos});
    this.hideAddContactInfoModal();
  };

  onEditContactInfo = contactInfo => {
    let contactInfos = this.state.contactInfos;
    let index = contactInfos.findIndex(item => item.id === contactInfo.id);
    contactInfos[index] = contactInfo;
    this.setState({contactInfos});
    this.hideEditContactInfoModal();
  };

  openEditContactInfoModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedContactInfo: row,
      showEditContactInfoModal: true
    });
  };

  hideEditContactInfoModal = () => {
    this.setState({
      selectedContactInfo: null,
      showEditContactInfoModal: false
    });
  };

  deleteContactInfo = (e, contactInfoID) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this Contact Info?', {
      title: 'Delete Contact Info'
    }).then(() => {
      ApiHelper.delete(`/api/contact-info/${contactInfoID}/`)
        .then(res => {
          let contactInfos = this.state.contactInfos;
          let index = contactInfos.findIndex(item => item.id === contactInfoID);
          contactInfos.splice(index, 1);
          this.setState({contactInfos});
          toastr.success('Success!', 'Contact Info was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Contact Info.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditContactInfoModal,
      selectedContactInfo
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Contact Info</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Contact Info</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditContactInfoModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditContactInfoModal &&
          selectedContactInfo.id === row.original.id &&
          <EditContactInfoModal
            show={showEditContactInfoModal}
            onHide={this.hideEditContactInfoModal}
            onSubmit={this.onEditContactInfo}
            selectedContactInfo={selectedContactInfo}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteContactInfo(e, row.original.id)
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
      contactInfos,
      showAddContactInfoModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddContactInfoModal}>Add Contact Info</button>
              {
                showAddContactInfoModal &&
                <AddContactInfoModal
                    {...this.props}
                    show={showAddContactInfoModal}
                    onHide={this.hideAddContactInfoModal}
                    onSubmit={this.onAddContactInfo}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Contact Info"
                content={
                  <ReactTable
                    data={contactInfos}
                    columns={[
                      {
                        Header: "ID",
                        accessor: "contact_id",
                        sortable: true,
                      },
                      {
                        Header: "NAME",
                        accessor: "name",
                        sortable: true,
                      },
                      {
                        Header: "TITLE",
                        accessor: "title",
                        sortable: true,
                      },
                      {
                        Header: "TYPE",
                        accessor: "type",
                      },
                      {
                        Header: "VALUE",
                        accessor: "value",
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
                    noDataText="No Contact Info Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactInfoTables);
