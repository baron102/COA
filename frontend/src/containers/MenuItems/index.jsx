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
import AddMenuItemsModal from "./AddMenuItemsModal";
import EditMenuItemsModal from "./EditMenuItemsModal";

class MenuItemsTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu_items: [],
      selectedID: null,
      showAddMenuItemsModal: false,
      showEditMenuItemsModal: false,
    };
  }

  componentWillMount() {
    this.getMenuItems();
  }

  getMenuItems() {
    ApiHelper.get('/api/menu_items/')
      .then(res => {
        this.setState({menu_items: res.data});
      });
  }

  showAddMenuItemsModal = () =>{
    this.setState({showAddMenuItemsModal: true
    })
  };

  hideAddMenuItemsModal = () =>{
    this.setState({showAddMenuItemsModal: false
    })
  };

  onAddMenuItems = menu_item => {
    let menu_items = this.state.menu_items;
    menu_items.push(menu_item);
    this.setState({menu_items});
    this.hideAddMenuItemsModal();
  };

  onEditMenuItems = menu_item => {
    let menu_items = this.state.menu_items;
    let index = menu_items.findIndex(item => item.id === menu_item.id);
    menu_items[index] = menu_item;
    this.setState({menu_items});
    this.hideEditMenuItemsModal();
  };

  openEditMenuItemsModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedID: row,
      showEditMenuItemsModal: true
    });
  };

  hideEditMenuItemsModal = () => {
    this.setState({
      selectedID: null,
      showEditMenuItemsModal: false
    });
  };

  deleteMenuItems = (e, menu_item) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this Menu Item?', {
      title: 'Delete Menu Item'
    }).then(() => {
      ApiHelper.delete(`/api/menu-item/${menu_item}/`)
        .then(res => {
          let menu_items = this.state.menu_items;
          let index = menu_items.findIndex(item => item.id === menu_item);
          menu_items.splice(index, 1);
          this.setState({menu_items});
          toastr.success('Success!', 'Menu Item was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Menu Item.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditMenuItemsModal,
      selectedID
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Menu Item</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Menu Item</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditMenuItemsModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditMenuItemsModal &&
          selectedID.id === row.original.id &&
          <EditMenuItemsModal
            show={showEditMenuItemsModal}
            onHide={this.hideEditMenuItemsModal}
            onSubmit={this.onEditMenuItems}
            selectedID={selectedID}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deleteMenuItems(e, row.original.id)
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
      menu_items,
      showAddMenuItemsModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddMenuItemsModal}>Add Menu Item</button>
              {
                showAddMenuItemsModal &&
                <AddMenuItemsModal
                    {...this.props}
                    show={showAddMenuItemsModal}
                    onHide={this.hideAddMenuItemsModal}
                    onSubmit={this.onAddMenuItems}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Menu Items"
                content={
                  <ReactTable
                    data={menu_items}
                    columns={[
                      {
                        Header: "MenuID",
                        accessor: "menu_id",
                        sortable: true,
                      },
                      {
                        Header: "Description",
                        accessor: "description",
                      },
                      {
                        Header: "Status",
                        accessor: "status",
                      },
                      {
                        Header: "Info",
                        accessor: "info",
                      },
                      {
                        Header: "ContainerPOD",
                        accessor: "container_pod",
                      },
                      {
                        Header: "HelpText",
                        accessor: "help_text",
                      },
                      {
                        Header: "LastUsed",
                        accessor: "last_used",
                      },
                      {
                        Header: "UsageCount",
                        accessor: "usage_count",
                      },
                      {
                        Header: "RolesUsed",
                        accessor: "roles_used",
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
                    noDataText="No Menu Item Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemsTables);
