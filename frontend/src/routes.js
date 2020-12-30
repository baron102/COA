import LoginPage from "./containers/Login";
import RegisterPage from "./containers/Login/Register";
import EditProfile from "./containers/profile";
import IDTables from "./containers/IDs";
import EntityTables from "./containers/Entities";
import ModelTables from "./containers/Models";
import AccountTables from "./containers/Accounts";
import JournalTables from "./containers/Journals";
import PlanTables from "./containers/Plans";
import TransIDTables from "./containers/TransIDs";
import TransTypeTables from "./containers/TransType";
import ContactInfoTables from "./containers/ContactInfo";
import ContactAddressTables from "./containers/ContactAddress";
import UsersTables from "./containers/Users";
import RolesTables from "./containers/Roles";
import UserRoleActionsTables from "./containers/UserRoleActions";
import MenuItemsTables from "./containers/MenuItems";
import RoleMenuTables from "./containers/RoleMenu";
import ItemsTables from "./containers/Items";
import ItemReferencesTables from "./containers/ItemReferences";
import ItemCountsTables from "./containers/ItemCounts";
import ItemTransTables from "./containers/ItemTrans";
import AppDataSetsTables from "./containers/AppDataSets";

const routes = [
  {
    path: "/login",
    access: "auth",
    name: "Login Page",
    icon: "pe-7s-info",
    component: LoginPage
  },
  {
    path: "/register",
    access: "auth",
    name: "Register Page",
    icon: "pe-7s-info",
    component: RegisterPage
  },
  {
    path: "/edit_profile",
    access: "common",
    name: "EDIT PROFILE",
    show: "false",
    icon: "pe-7s-info",
    component: EditProfile
  },
  {
    path: "/id",
    access: "common",
    name: "ID",
    show: "true",
    icon: "pe-7s-users",
    component: IDTables
  },
  {
    path: "/entities",
    access: "common",
    name: "Entities",
    show: "true",
    icon: "pe-7s-users",
    component: EntityTables
  },
  {
    path: "/models",
    access: "common",
    name: "COAModels",
    show: "true",
    icon: "pe-7s-users",
    component: ModelTables
  },
  {
    path: "/accounts",
    access: "common",
    name: "Accounts",
    show: "true",
    icon: "pe-7s-users",
    component: AccountTables
  },
  {
    path: "/journals",
    access: "common",
    name: "Journals",
    show: "true",
    icon: "pe-7s-users",
    component: JournalTables
  },
  {
    path: "/plans",
    access: "common",
    name: "Plans",
    show: "true",
    icon: "pe-7s-users",
    component: PlanTables
  },
  {
    path: "/trans-ids",
    access: "common",
    name: "Trans IDs",
    show: "true",
    icon: "pe-7s-users",
    component: TransIDTables
  },
  {
    path: "/trans-types",
    access: "common",
    name: "Trans Types",
    show: "true",
    icon: "pe-7s-users",
    component: TransTypeTables
  },
  {
    path: "/contact-info",
    access: "common",
    name: "Contact Info",
    show: "true",
    icon: "pe-7s-users",
    component: ContactInfoTables
  },
  {
    path: "/contact-address",
    access: "common",
    name: "Contact Address",
    show: "true",
    icon: "pe-7s-users",
    component: ContactAddressTables
  },
  {
    path: "/users",
    access: "common",
    name: "Users",
    show: "true",
    icon: "pe-7s-users",
    component: UsersTables
  },  
  {
    path: "/roles",
    access: "common",
    name: "Roles",
    show: "true",
    icon: "pe-7s-users",
    component: RolesTables
  },  
  {
    path: "/user_role_actions",
    access: "common",
    name: "UserRoleActions",
    show: "true",
    icon: "pe-7s-users",
    component: UserRoleActionsTables
  },  
  {
    path: "/menu_items",
    access: "common",
    name: "MenuItems",
    show: "true",
    icon: "pe-7s-users",
    component: MenuItemsTables
  },  
  {
    path: "/role_menu",
    access: "common",
    name: "RoleMenu",
    show: "true",
    icon: "pe-7s-users",
    component: RoleMenuTables
  },  
  {
    path: "/items",
    access: "common",
    name: "Items",
    show: "true",
    icon: "pe-7s-users",
    component: ItemsTables
  },  
  {
    path: "/item_references",
    access: "common",
    name: "ItemReferences",
    show: "true",
    icon: "pe-7s-users",
    component: ItemReferencesTables
  },  
  {
    path: "/item_counts",
    access: "common",
    name: "ItemCounts",
    show: "true",
    icon: "pe-7s-users",
    component: ItemCountsTables
  },  
  {
    path: "/item_trans",
    access: "common",
    name: "ItemTrans",
    show: "true",
    icon: "pe-7s-users",
    component: ItemTransTables
  },  
  {
    path: "/app_data_sets",
    access: "common",
    name: "AppDataSets",
    show: "true",
    icon: "pe-7s-users",
    component: AppDataSetsTables
  },  
];
export default routes;
