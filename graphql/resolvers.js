const User = require('../models/User');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const { uploadImage } = require('../utils/cloudinary');

const resolvers = {
  Query: {
    // Login - allow user to access the system using username/email and password
    login: async (_, { usernameOrEmail, password }) => {
      const user = await User.findOne({
        $or: [
          { username: usernameOrEmail.toLowerCase() },
          { email: usernameOrEmail.toLowerCase() }
        ]
      });

      if (!user) {
        throw new Error('Invalid username/email or password');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid username/email or password');
      }

      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { token, user };
    },

    // Get all employees
    getAllEmployees: async () => {
      return await Employee.find();
    },

    // Search employee by ID
    searchEmployeeById: async (_, { eid }) => {
      const employee = await Employee.findById(eid);
      if (!employee) {
        throw new Error(`Employee with ID ${eid} not found`);
      }
      return employee;
    },

    // Search employee by designation or department
    searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
      if (!designation && !department) {
        throw new Error('Please provide at least a designation or department to search');
      }

      const filter = {};
      if (designation && department) {
        filter.$or = [
          { designation: { $regex: designation, $options: 'i' } },
          { department: { $regex: department, $options: 'i' } }
        ];
      } else if (designation) {
        filter.designation = { $regex: designation, $options: 'i' };
      } else {
        filter.department = { $regex: department, $options: 'i' };
      }

      return await Employee.find(filter);
    }
  },

  Mutation: {
    // Signup - allow user to create new account
    signup: async (_, { username, email, password }) => {
      // Check if username already exists
      const existingUsername = await User.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        throw new Error('Username already exists');
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        throw new Error('Email already exists');
      }

      // Validate email format
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please provide a valid email address');
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const user = new User({ username, email, password });
      return await user.save();
    },

    // Add new employee
    addEmployee: async (_, args) => {
      // Check if email already exists
      const existingEmployee = await Employee.findOne({ email: args.email.toLowerCase() });
      if (existingEmployee) {
        throw new Error('An employee with this email already exists');
      }

      // Validate gender
      if (!['Male', 'Female', 'Other'].includes(args.gender)) {
        throw new Error('Gender must be Male, Female, or Other');
      }

      // Validate salary
      if (args.salary < 1000) {
        throw new Error('Salary must be at least 1000');
      }

      // Upload photo to Cloudinary if provided
      let employeePhoto = null;
      if (args.employee_photo) {
        try {
          employeePhoto = await uploadImage(args.employee_photo);
        } catch (error) {
          // Store the URL/path as-is if Cloudinary upload fails
          employeePhoto = args.employee_photo;
        }
      }

      const employee = new Employee({
        ...args,
        employee_photo: employeePhoto
      });
      return await employee.save();
    },

    // Update employee by ID
    updateEmployee: async (_, { eid, ...updates }) => {
      const employee = await Employee.findById(eid);
      if (!employee) {
        throw new Error(`Employee with ID ${eid} not found`);
      }

      // Validate gender if provided
      if (updates.gender && !['Male', 'Female', 'Other'].includes(updates.gender)) {
        throw new Error('Gender must be Male, Female, or Other');
      }

      // Validate salary if provided
      if (updates.salary !== undefined && updates.salary < 1000) {
        throw new Error('Salary must be at least 1000');
      }

      // Check email uniqueness if being updated
      if (updates.email && updates.email !== employee.email) {
        const existingEmployee = await Employee.findOne({ email: updates.email.toLowerCase() });
        if (existingEmployee) {
          throw new Error('An employee with this email already exists');
        }
      }

      // Upload photo to Cloudinary if new photo provided
      if (updates.employee_photo) {
        try {
          updates.employee_photo = await uploadImage(updates.employee_photo);
        } catch (error) {
          // Keep the provided URL/path as-is
        }
      }

      // Remove undefined fields
      const cleanUpdates = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          cleanUpdates[key] = value;
        }
      }

      const updatedEmployee = await Employee.findByIdAndUpdate(
        eid,
        { $set: cleanUpdates },
        { new: true, runValidators: true }
      );

      return updatedEmployee;
    },

    // Delete employee by ID
    deleteEmployee: async (_, { eid }) => {
      const employee = await Employee.findByIdAndDelete(eid);
      if (!employee) {
        throw new Error(`Employee with ID ${eid} not found`);
      }
      return { message: `Employee with ID ${eid} deleted successfully` };
    }
  }
};

module.exports = resolvers;
