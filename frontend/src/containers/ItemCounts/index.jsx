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
import AddItemCountsModal from "./AddItemCountsModal";
import EditItemCountsModal from "./EditItemCountsModal";

class ItemCountsTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_counts: [],
      selectedID: null,
      showAddItemCountsModal: false,
      showEditItemCountsModal: false,
    };
  }

  componentWillMount() {
    this.getItemCountss();
  }

  getItemCountss() {
    ApiHelper.get('/api/item_counts/')
      .then(res => {
        this.setState({item_counts: res.data});
      });
  }

  showAddItemCountsModal = () =>{
    this.setState({showAddItemCountsModal: true
    })
  };

  hideAddItemCountsModal = () =>{
    this.setState({showAddItemCountsModal: false
    })
  };

  onAddItemCounts = item_count => {
    let item_counts = this.state.item_counts;
    item_counts.push(item_count);
    this.setState({item_counts});
    this.hideAddItemCountsModal();
  };

  onEditItemCounts = item_count => {
    let item_counts = this.state.item_counts;
    let index = item_counts.findIndex(item => item.id === item_count.id);
    item_counts[index] = item_count;
    this.setState({item_counts});
    this.hideEditItemCountsModal();
  };

  openEditItemCountsModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedID: row,
      showEditItemCountsModal: true
    });
  };

  hideEditItemCountsModal = () => {
    this.setState({
      selectedID: null,
      showEditItemCountsModal: false
    });
  };

  deleteItemCounts = (e, item_count) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this Item Count?', {
      title: 'Delete Item Count'
    }).then(() => {
      ApiHelper.delete(`/api/item_counts/${item_count}/`)
        .then(res => {
          let item_counts = this.state.item_counts;
          let index = item_counts.findIndex(item => item.id === item_count);
          item_counts.splice(index, 1);
          this.setState({item_counts});
          toastr.success('Success!', 'Item Count was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Item Count.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditItemCountsModal,
      selectedID
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Item Count</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Item Count</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditItemCountsModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditItemCountsModal &&
          selectedID.id === row.original.id &&
          <EditItemCountsModal
            show={showEditItemCountsModal}
            onHide={this.hideEditItemCountsModal}
            onSubmit={this.onEditItemCounts}
            selectedID={selectedID}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteItemCounts(e, row.original.id)
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
      item_counts,
      showAddItemCountsModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddItemCountsModal}>Add Item Count</button>
              {
                showAddItemCountsModal &&
                <AddItemCountsModal
                    {...this.props}
                    show={showAddItemCountsModal}
                    onHide={this.hideAddItemCountsModal}
                    onSubmit={this.onAddItemCounts}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Item Counts"
                content={
                  <ReactTable
                    data={item_counts}
                    columns={[
                      {
                        Header: "Item ID",
                        accessor: "item_id",
                        sortable: true,
                      },
                      {
                        Header: "Count Type",
                        accessor: "count_type",
                      },
                      {
                        Header: "Plan Total",
                        accessor: "plan_total",
                      },
                      {
                        Header: "Plan Rows",
                        accessor: "plan_rows",
                      },
                      {
                        Header: "Plan Year",
                        accessor: "plan_year",
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
                    noDataText="No Item Count Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemCountsTables);
