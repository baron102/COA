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
import AddItemReferencesModal from "./AddItemReferencesModal";
import EditItemReferencesModal from "./EditItemReferencesModal";

class ItemReferencesTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_references: [],
      selectedID: null,
      showAddItemReferencesModal: false,
      showEditItemReferencesModal: false,
    };
  }

  componentWillMount() {
    this.getItemReferencess();
  }

  getItemReferencess() {
    ApiHelper.get('/api/item_references/')
      .then(res => {
        this.setState({item_references: res.data});
      });
  }

  showAddItemReferencesModal = () =>{
    this.setState({showAddItemReferencesModal: true
    })
  };

  hideAddItemReferencesModal = () =>{
    this.setState({showAddItemReferencesModal: false
    })
  };

  onAddItemReferences = item_reference => {
    let item_references = this.state.item_references;
    item_references.push(item_reference);
    this.setState({item_references});
    this.hideAddItemReferencesModal();
  };

  onEditItemReferences = item_reference => {
    let item_references = this.state.item_references;
    let index = item_references.findIndex(item => item.id === item_reference.id);
    item_references[index] = item_reference;
    this.setState({item_references});
    this.hideEditItemReferencesModal();
  };

  openEditItemReferencesModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedID: row,
      showEditItemReferencesModal: true
    });
  };

  hideEditItemReferencesModal = () => {
    this.setState({
      selectedID: null,
      showEditItemReferencesModal: false
    });
  };

  deleteItemReferences = (e, item_reference) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this Item Reference?', {
      title: 'Delete Item Reference'
    }).then(() => {
      ApiHelper.delete(`/api/item_references/${item_reference}/`)
        .then(res => {
          let item_references = this.state.item_references;
          let index = item_references.findIndex(item => item.id === item_reference);
          item_references.splice(index, 1);
          this.setState({item_references});
          toastr.success('Success!', 'Item Reference was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Item Reference.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditItemReferencesModal,
      selectedID
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Item Reference</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Item Reference</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditItemReferencesModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditItemReferencesModal &&
          selectedID.id === row.original.id &&
          <EditItemReferencesModal
            show={showEditItemReferencesModal}
            onHide={this.hideEditItemReferencesModal}
            onSubmit={this.onEditItemReferences}
            selectedID={selectedID}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteItemReferences(e, row.original.id)
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
      item_references,
      showAddItemReferencesModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddItemReferencesModal}>Add Item Reference</button>
              {
                showAddItemReferencesModal &&
                <AddItemReferencesModal
                    {...this.props}
                    show={showAddItemReferencesModal}
                    onHide={this.hideAddItemReferencesModal}
                    onSubmit={this.onAddItemReferences}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Item References"
                content={
                  <ReactTable
                    data={item_references}
                    columns={[
                      {
                        Header: "Item ID",
                        accessor: "item_id",
                        sortable: true,
                      },
                      {
                        Header: "Reference Type",
                        accessor: "reference_type",
                      },
                      {
                        Header: "ReferenceValue",
                        accessor: "reference_value",
                      },
                      {
                        Header: "ReferenceSource",
                        accessor: "reference_source",
                      },
                      {
                        Header: "Info",
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
                    noDataText="No Item Reference Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemReferencesTables);
