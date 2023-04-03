const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    model: { type: String, required: true },
    serialNumber: { type: String, required: true },
    assignedDate: { type: Date, required: true, default: Date.now },
  });
  
const employeeSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  dateOfJoining: { type: String, required: true },
  contactNo: { type: Number, required: true },
  personalEmail: { type: String, required: true },
  officialEmail: { type: String, required: true },
  assets:[assetSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;