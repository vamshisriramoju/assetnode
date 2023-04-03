require("dotenv").config();
const jwt = require("jsonwebtoken");
const Employee = require("../models/employee");

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

    const employee = new Employee({
      employeeName,
      employeeId,
      designation,
      department,
      dateOfJoining,
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
      message: "successfully deleted this employee",
    }); // No Content
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// get all employees without pagination and limit
// exports.getEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     res.json(employees);
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// };

// get all employees with pagination and limit
exports.getEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of records per page

  try {
    const count = await Employee.countDocuments(); // Total number of records
    const employees = await Employee.find()
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
exports.deAllocateAsset = async (req, res) => {
  try {
    console.log("deAllocating");
    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.body.employeeId },
      { $set: { assets: req.body.asset } },
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
