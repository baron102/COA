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
import AddItemTransModal from "./AddItemTransModal";
import EditItemTransModal from "./EditItemTransModal";

class ItemTransTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_trans: [],
      selectedID: null,
      showAddItemTransModal: false,
      showEditItemTransModal: false,
    };
  }

  componentWillMount() {
    this.getItemTranss();
  }

  getItemTranss() {
    ApiHelper.get('/api/item_trans/')
      .then(res => {
        this.setState({item_trans: res.data});
      });
  }

  showAddItemTransModal = () =>{
    this.setState({showAddItemTransModal: true
    })
  };

  hideAddItemTransModal = () =>{
    this.setState({showAddItemTransModal: false
    })
  };

  onAddItemTrans = item_tran => {
    let item_trans = this.state.item_trans;
    item_trans.push(item_tran);
    this.setState({item_trans});
    this.hideAddItemTransModal();
  };

  onEditItemTrans = item_tran => {
    let item_trans = this.state.item_trans;
    let index = item_trans.findIndex(item => item.id === item_tran.id);
    item_trans[index] = item_tran;
    this.setState({item_trans});
    this.hideEditItemTransModal();
  };

  openEditItemTransModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedID: row,
      showEditItemTransModal: true
    });
  };

  hideEditItemTransModal = () => {
    this.setState({
      selectedID: null,
      showEditItemTransModal: false
    });
  };

  deleteItemTrans = (e, item_tran) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this Item Trans?', {
      title: 'Delete Item Trans'
    }).then(() => {
      ApiHelper.delete(`/api/item_trans/${item_tran}/`)
        .then(res => {
          let item_trans = this.state.item_trans;
          let index = item_trans.findIndex(item => item.id === item_tran);
          item_trans.splice(index, 1);
          this.setState({item_trans});
          toastr.success('Success!', 'Item Trans was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Item Trans.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditItemTransModal,
      selectedID
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Item Trans</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Item Trans</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditItemTransModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditItemTransModal &&
          selectedID.id === row.original.id &&
          <EditItemTransModal
            show={showEditItemTransModal}
            onHide={this.hideEditItemTransModal}
            onSubmit={this.onEditItemTrans}
            selectedID={selectedID}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteItemTrans(e, row.original.id)
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
      item_trans,
      showAddItemTransModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddItemTransModal}>Add Item Trans</button>
              {
                showAddItemTransModal &&
                <AddItemTransModal
                    {...this.props}
                    show={showAddItemTransModal}
                    onHide={this.hideAddItemTransModal}
                    onSubmit={this.onAddItemTrans}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Item Trans"
                content={
                  <ReactTable
                    data={item_trans}
                    columns={[
                      {
                        Header: "Trans ID",
                        accessor: "trans_id",
                        sortable: true,
                      },
                      {
                        Header: "ItemID",
                        accessor: "item_id",
                      },
                      {
                        Header: "Trandate",
                        accessor: "tran_date",
                      },
                      {
                        Header: "Transuser",
                        accessor: "trans_user",
                      },
                      {
                        Header: "Transtype",
                        accessor: "trans_type",
                      },
                      {
                        Header: "Entity",
                        accessor: "entity",
                      },
                      {
                        Header: "Reference",
                        accessor: "reference",
                      },
                      {
                        Header: "Quantity",
                        accessor: "quantity",
                      },
                      {
                        Header: "Warehouse",
                        accessor: "warehouse",
                      },
                      {
                        Header: "Location",
                        accessor: "location",
                      },
                      {
                        Header: "Bin",
                        accessor: "bin",
                      },
                      {
                        Header: "Revenue",
                        accessor: "revenue",
                      },
                      {
                        Header: "Cost",
                        accessor: "cost",
                      },
                      {
                        Header: "Notes",
                        accessor: "notes",
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
                    noDataText="No Item Trans Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemTransTables);
