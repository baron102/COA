import {createConfirmation} from 'react-confirm';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal.jsx';
import moment from 'moment';

const validateEmail = (email) => {
  // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const showConfirmModal = createConfirmation(ConfirmModal);

const confirm = (confirmation, options = {}) => {

  return showConfirmModal({confirmation, ...options});
};

// const countryFormatter = (cell, row) =>{
//   if(!cell)
//     return null;
//   return getName(cell);
// }

const timestampFormatter = (cell, row) => {
  let date = moment(cell);
  return date.format('YYYY-MM-DD HH:mm');
};

export {
  validateEmail,
  confirm,
  timestampFormatter
}