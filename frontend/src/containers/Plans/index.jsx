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
import AddPlanModal from "./AddPlanModal";
import EditPlanModal from "./EditPlanModal";

class PlanTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: [],
      selectedPlan: null,
      showAddPlanModal: false,
      showEditPlanModal: false,
    };
  }

  componentWillMount() {
    this.getPlans();
  }

  getPlans() {
    ApiHelper.get('/api/plans/')
      .then(res => {
        this.setState({plans: res.data});
      });
  }

  showAddPlanModal = () =>{
    this.setState({showAddPlanModal: true
    })
  };

  hideAddPlanModal = () =>{
    this.setState({showAddPlanModal: false
    })
  };

  onAddPlan = plan => {
    let plans = this.state.plans;
    plans.push(plan);
    this.setState({plans});
    this.hideAddPlanModal();
  };

  onEditPlan = plan => {
    let plans = this.state.plans;
    let index = plans.findIndex(item => item.id === plan.id);
    plans[index] = plan;
    this.setState({plans});
    this.hideEditPlanModal();
  };

  openEditPlanModal = (e, row) => {
    e.stopPropagation();
    this.setState({
      selectedPlan: row,
      showEditPlanModal: true
    });
  };

  hideEditPlanModal = () => {
    this.setState({
      selectedPlan: null,
      showEditPlanModal: false
    });
  };

  deletePlan = (e, planID) => {
    e.stopPropagation();
    confirm('Are you sure you want to delete this plan?', {
      title: 'Delete Plan'
    }).then(() => {
      ApiHelper.delete(`/api/plans/${planID}/`)
        .then(res => {
          let plans = this.state.plans;
          let index = plans.findIndex(item => item.id === planID);
          plans.splice(index, 1);
          this.setState({plans});
          toastr.success('Success!', 'Plan was successfully deleted.');
        }).catch(err => {
        console.log(err);
        toastr.error('Fail!', 'Failed to delete Plan.');
      });
    });
  };

  renderCell = (row) => {
    const {
      showEditPlanModal,
      selectedPlan
    } = this.state

    const edit = <Tooltip id="edit_tooltip">Edit Plan</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Delete Plan</Tooltip>;

    return(
      <div>
        <OverlayTrigger placement="top" overlay={edit}>
          <Button
            // bsStyle="info"
            simple
            icon
            onClick={
              (e) => this.openEditPlanModal(e, row.original)
            }
          >
            <i className="fa fa-edit fa-lg" />
          </Button>
        </OverlayTrigger>
        {
          showEditPlanModal &&
          selectedPlan.id === row.original.id &&
          <EditPlanModal
            show={showEditPlanModal}
            onHide={this.hideEditPlanModal}
            onSubmit={this.onEditPlan}
            selectedPlan={selectedPlan}
          />
        }
        <OverlayTrigger placement="top" overlay={remove}>
          <Button
            // bsStyle="danger"
            simple
            icon
            onClick={
              (e) => this.deletePlan(e, row.original.id)
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
      plans,
      showAddPlanModal,
    } = this.state

    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{marginBottom: 30}}>
              <button type="btn" className="btn btn-info"
                      style={{fontSize:18}} onClick={this.showAddPlanModal}>Add Plan</button>
              {
                showAddPlanModal &&
                <AddPlanModal
                    {...this.props}
                    show={showAddPlanModal}
                    onHide={this.hideAddPlanModal}
                    onSubmit={this.onAddPlan}
                />
              }
            </Col>
            <Col md={12}>
              <Card
                title = "Plans"
                content={
                  <ReactTable
                    data={plans}
                    columns={[
                      {
                        Header: "ID",
                        accessor: "plan_id",
                        sortable: true,
                      },
                      {
                        Header: "TYPE",
                        accessor: "type",
                      },
                      {
                        Header: "TOTAL",
                        accessor: "total",
                      },
                      {
                        Header: "ROWS",
                        accessor: "rows",
                      },
                      {
                        Header: "YEAR",
                        accessor: "year",
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
                    noDataText="No Plans Found"
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

export default connect(mapStateToProps, mapDispatchToProps)(PlanTables);
