require("dotenv").config();
const jwt = require("jsonwebtoken");
const Employee = require("../models/employee");
const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");


// create a new employee
exports.addEmployee = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("userId", userId,req);

    const {
      employeeName,
      employeeId,
      designation,
      department,
      dateOfJoining,
      contactNo,
      personalEmail,
      officialEmail,
    } = req.body;

    const date = new Date(dateOfJoining); // Create a new date object from the string
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); // Format the date as a string in the desired format

    const employee = new Employee({
      employeeName,
      employeeId,
      designation,
      department,
      dateOfJoining : formattedDate,
      contactNo,
      personalEmail,
      officialEmail,
      createdBy: userId
    });

    await employee.save();

    res.status(201).json(employee);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// update employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.body.employeeId },
      req.body,
      { new: true }
    );
    if (!employee) {
      return res.status(404).send({ message: "Employee not found" });
    }
    res.send(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Server error" });
  }
};

//delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const userId = req.user.userId;

    const employee = await Employee.findOne({
      employeeId: req.body.employeeId,
    });

    if (!employee) {
      return res.status(404).send({ message: "Employee not found" });
    }
    console.log(employee.createdBy, userId);

    if (employee.createdBy != userId) {
      return res.status(403).send({
        message: "You do not have permission to delete this employee",
      });
    }

    await Employee.findOneAndDelete({ employeeId: req.body.employeeId });

    res.status(204).send({
      message: `Employee with employeeId ${req.body.employeeId} has been deleted successfully`,
    }); // No Content
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// get all employees with pagination and limit
exports.getEmployees = async (req, res) => {
  console.log('request', req.user)
  // const page = parseInt(req.query.page) || 1; // Current page number
  // const limit = parseInt(req.query.limit) || 10; // Number of records per page
  const page = parseInt(req.body.page) || 1; // Current page number
  const limit = parseInt(req.body.limit) || 20; // Number of records per page

  try {
    const count = await Employee.countDocuments({createdBy:new ObjectId(req.user.userId)}); // Total number of records
    const employees = await Employee.find({createdBy:new ObjectId(req.user.userId)})
    .skip((page - 1) * limit) // Skip records
      .limit(limit); // Limit records

      res.json({
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        employees: employees
      });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};


// getEmployees in ascending order
// exports.getEmployees = async (req, res) => {
//   console.log('request', req.user)
//   const page = parseInt(req.body.page) || 1; // Current page number
//   const limit = parseInt(req.body.limit) || 20; // Number of records per page
//   const sortField = "employeeId";
//   const sortOrder = 1; // Ascending order

//   try {
//     const count = await Employee.countDocuments({createdBy:new ObjectId(req.user.userId)}); // Total number of records
//     const employees = await Employee.find({createdBy:new ObjectId(req.user.userId)})
//       .sort({ [sortField]: sortOrder }) // Sort by employeeId in ascending order
//       .skip((page - 1) * limit) // Skip records
//       .limit(limit) // Limit records
//       .lean() // Convert documents to plain JavaScript objects
//       .exec(); // Execute the query

//     // Format the employeeId field as "emp1", "emp2", etc.
//     employees.forEach((employee, index) => {
//       employee.employeeId = `emp${index + 1}`;
//     });

//     res.json({
//       total: count,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//       employees: employees
//     });
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// };


exports.getEmployeeById = async (req, res) => {
  try {
    const employees = await Employee.findOne({
      employeeId: req.body.employeeId,
    });
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// allocating a new asset
exports.allocateAsset = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.body.employeeId },
      { $push: { assets: req.body.asset } },
      { new: true }
    );
    if (!employee) {
      return res.status(404).send({ message: "Employee not found" });
    }
    res.send(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Server error" });
  }
};

// deallocate asset
// exports.deAllocateAsset = async (req, res) => {
//   try {
//     const employee = await Employee.findOneAndUpdate(
//       { employeeId: req.body.employeeId },
//       //{ $set: { assets: req.body.asset } },
//      // { $pull: { assets: { _id: req.body._id } } },
//      { $pull: { assets: { _id: new mongoose.Types.ObjectId(req.body._id) } } },

//       { new: true }
//     );
//     // Check if the string is a valid ObjectId
// if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
//   return res.status(400).json({ message: 'Invalid ObjectId' });
// }
//     if (!employee) {
//       return res.status(404).send({ message: "Employee not found" });
//     }
//     res.send(employee);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send({ message: "Server error" });
//   }
// };


exports.deAllocateAsset = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.body.employeeId },
      { $pull: { assets: { _id: req.body.assetId } } },
      { new: true }
    );
    if (!employee) {
      return res.status(404).send({ message: "Employee not found" });
    }
    res.send(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Server error" });
  }
};
