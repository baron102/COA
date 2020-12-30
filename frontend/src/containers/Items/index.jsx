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
import AddItemsModal from "./AddItemsModal";
import EditItemsModal from "./EditItemsModal";

class ItemsTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      selectedID: null,
      showAddItemsModal: false,
      showEditItemsModal: false,
    };
  }

  componentWillMount() {
    this.getItemss();
  }

  getItemss() {
    ApiHelper.get('/api/items/')
      .then(res => {
        this.setState({items: res.data});
      });
  }

  showAddItemsModal = () =>{
    this.setState({showAddItemsModal: true
    })
  };

  hideAddItemsModal = () =>{
    this.setState({showAddItemsModal: false
    })
  };

  onAddItems = item => {
    let items = this.state.items;
    items.push(item);
    this.setState({items});
    this.hideAddItemsModal();
  };

  onEditItems = item => {
    let items = this.state.items;
    let index = items.findIndex(item => item.id === item.id);
    items[index] = item;
    this.setState({items});
    this.hideEditItemsModal();
  };

  openEditItemsModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedID: row,
      showEditItemsModal: true
    });
  };

  hideEditItemsModal = () => {
    this.setState({
      selectedID: null,
      showEditItemsModal: false
    });
  };

  deleteItems = (e, item) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this Item?', {
      title: 'Delete Item'
    }).then(() => {
      ApiHelper.delete(`/api/items/${item}/`)
        .then(res => {
          let items = this.state.items;
          let index = items.findIndex(item => item.id === item);
          items.splice(index, 1);
          this.setState({items});
          toastr.success('Success!', 'Item was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Item.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditItemsModal,
      selectedID
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Item</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Item</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditItemsModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditItemsModal &&
          selectedID.id === row.original.id &&
          <EditItemsModal
            show={showEditItemsModal}
            onHide={this.hideEditItemsModal}
            onSubmit={this.onEditItems}
            selectedID={selectedID}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteItems(e, row.original.id)
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
      items,
      showAddItemsModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddItemsModal}>Add Item</button>
              {
                showAddItemsModal &&
                <AddItemsModal
                    {...this.props}
                    show={showAddItemsModal}
                    onHide={this.hideAddItemsModal}
                    onSubmit={this.onAddItems}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Items"
                content={
                  <ReactTable
                    data={items}
                    columns={[
                      {
                        Header: "Item ID",
                        accessor: "item_id",
                        sortable: true,
                      },
                      {
                        Header: "Short Description",
                        accessor: "short_description",
                      },
                      {
                        Header: "Long Description",
                        accessor: "long_description",
                      },
                      {
                        Header: "Item Type",
                        accessor: "item_type",
                      },
                      {
                        Header: "Last Used",
                        accessor: "last_used",
                      },
                      {
                        Header: "Zip",
                        accessor: "zip",
                      },
                      {
                        Header: "Location Name",
                        accessor: "location_name",
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
                    noDataText="No Item Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemsTables);
