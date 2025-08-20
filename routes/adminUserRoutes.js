const express = require('express');
const { authValidation } = require('../middlewares/authValidation');
const { authorizedRoles } = require('../middlewares/roleMiddleware');
const { adminCreateUser, deleteUserByAdmin } = require('../controllers/admin/adminUserController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const adminUserRouter = express.Router();

adminUserRouter.post('/adminCreateUser', authMiddleware, authValidation, authorizedRoles, adminCreateUser);
adminUserRouter.delete('/deleteUserByAdmin/:id', authMiddleware, authorizedRoles, deleteUserByAdmin);

module.exports = { adminUserRouter };   