import express from 'express';
import Papa from 'papaparse'; // For parsing CSV files
import {
  addRole,
  deleteRole,
  getRoles,
  setRole
} from '../controllers/moduleController.js';
import {
  userAuth
} from '../middleware/userAuth.js';
// import upload from '../middleware/multerUpload.js';

const moduleRouter = express.Router();

// Existing routes
moduleRouter
  .post('/role', addRole)
  .post('/role/set', setRole)
  .get('/role', getRoles)
  .delete('/role', deleteRole);


moduleRouter.post('/set-role', setRole);


export default moduleRouter