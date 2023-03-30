const express = require("express");
const router = express.Router();
const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  allocateAsset,
  deAllocateAsset,
  getEmployeeById,
} = require("../controllers/employee");
const authenticateJWT = require("../middleware/authenticateJWT");

router.post("/addEmployee", authenticateJWT, addEmployee);                                  // add employee route
router.post("/updateEmployee", authenticateJWT, updateEmployee);                           // update employee route
router.post("/deleteEmployee", authenticateJWT, deleteEmployee);                          // delete employee route
router.get("/getEmployees", authenticateJWT, getEmployees);                              // get employees route
router.post("/getEmployeeById", authenticateJWT, getEmployeeById);                      // get employee by id route
router.post("/asset/allocate", authenticateJWT, allocateAsset);                        // allocate asset to employee route
router.post("/asset/deAllocate", authenticateJWT, deAllocateAsset);                   // deallocate asset to employee route
module.exports = router;
