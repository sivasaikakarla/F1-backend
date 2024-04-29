const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
const multer = require('multer');
const path = require('path');
const morgan = require('morgan')
var rfs = require('rotating-file-stream') 

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const fileUpload=require('./middleware/fileUpload');
// const HttpError = require('./models/http-error');
// const HttpError = require('./middleware/HttpError')

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const options ={
  definition:{
    openapi:'3.0.0',
    info:{
      title:'F1 Gas Agency Application',
      version:'1.0.0'
    },
    servers:[
      {
        url: 'http://localhost:8080/'
      }
    ]
  },
  apis:['./index.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))





app.use((err, req, res, next) => {
  console.log("error occured")
  // Log the error for debugging purposes
  console.error(err.stack);

  // Set the HTTP status code and send an error response
  res.status(500).send("Internal Server Error");
});

var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', 
  path: path.join(__dirname, 'log')
})

app.use(morgan('combined', { stream: accessLogStream }))


const Port = process.env.PORT || 8080;

console.log(process.env.MONGODB_URL);

var nodemailer = require('nodemailer');

var mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kakarlasivasai043@gmail.com',
        pass: 'svlfvkjzhatftelm'
    }
});

const otpStore = {};
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));


 
  /**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - phone
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         fullName:
 *           type: string
 *           description: The full name of the user
 *         phone:
 *           type: integer
 *           description: The phone number of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         password:
 *           type: string
 *           format: password
 *           description: The password of the user
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Confirm password for validation
 */


const userSchema = mongoose.Schema({
  fullName: String,
  phone: Number,
  email: String,
  password: String,
  confirmPassword: String,
});

const connSchema = mongoose.Schema({
  fullName: String,
  phone: Number,
  email: String,
  aadhar: Number,
  gender: String,
  dob: Date,
  address: String,
  area: String,
  document: String,
  connectionId: {
    type: String,
    required: true,
    default: generateConnectionId,
  },
  status: {
    type: String,
    default: 'pending'
  },

});


/**
 * @swagger
 * components:
 *   schemas:
 *     Connection:
 *       type: object
 *       required:
 *         - fullName
 *         - phone
 *         - email
 *         - aadhar
 *         - gender
 *         - dob
 *         - address
 *         - area
 *         - document
 *       properties:
 *         fullName:
 *           type: string
 *           description: The full name of the user
 *         phone:
 *           type: integer
 *           description: The phone number of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         aadhar:
 *           type: integer
 *           description: Aadhar number of the user
 *         gender:
 *           type: string
 *           description: Gender of the user
 *         dob:
 *           type: string
 *           format: date
 *           description: Date of birth of the user
 *         address:
 *           type: string
 *           description: Address of the user
 *         area:
 *           type: string
 *           description: Area of the user
 *         document:
 *           type: string
 *           description: Document associated with the connection
 *         connectionId:
 *           type: string
 *           description: Unique ID for the connection
 *           required: true
 *         status:
 *           type: string
 *           description: Status of the connection
 *           default: pending
 */



const dbSchema = mongoose.Schema({
  fullName: String,
  phone:Number,
  email:String,
  password: String,
  confirmPassword: String,
  dob: Date,
  area: String,
  document: String,
  status: {
    type: String,
    default: 'pending'
  }, 
});

/**
 * @swagger
 * components:
 *   schemas:
 *     DatabaseUser:
 *       type: object
 *       required:
 *         - fullName
 *         - phone
 *         - email
 *         - password
 *         - confirmPassword
 *         - dob
 *         - area
 *         - document
 *       properties:
 *         fullName:
 *           type: string
 *           description: The full name of the user
 *         phone:
 *           type: integer
 *           description: The phone number of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         password:
 *           type: string
 *           format: password
 *           description: The password of the user
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Confirm password for validation
 *         dob:
 *           type: string
 *           format: date
 *           description: Date of birth of the user
 *         area:
 *           type: string
 *           description: Area of the user
 *         document:
 *           type: string
 *           description: Document associated with the user
 *         status:
 *           type: string
 *           description: Status of the user
 *           default: pending
 */


const orderSchema = mongoose.Schema({
  connection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'newconnection',
  },
  orderId: {
    type: String,
    required: true,
    default: generateOrderId,
  },
  type: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'pending'
  },

});

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - connection
 *         - orderId
 *       properties:
 *         connection:
 *           type: string
 *           description: The ID of the connection associated with the order
 *         orderId:
 *           type: string
 *           description: The ID of the order
 *           required: true
 *         type:
 *           type: string
 *           description: The type of the order
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the order
 *         status:
 *           type: string
 *           description: The status of the order
 *           default: pending
 */


const complaintSchema = mongoose.Schema({
  connection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'newconnection',
  },
  complaintId: {
    type: String,
    required: true,
    default: generateOrderId,
  },
  type: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'pending'
  },

});

/**
 * @swagger
 * components:
 *   schemas:
 *     Complaint:
 *       type: object
 *       required:
 *         - connection
 *         - complaintId
 *       properties:
 *         connection:
 *           type: string
 *           description: The ID of the connection associated with the complaint
 *         complaintId:
 *           type: string
 *           description: The ID of the complaint
 *           required: true
 *         type:
 *           type: string
 *           description: The type of the complaint
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the complaint
 *         status:
 *           type: string
 *           description: The status of the complaint
 *           default: pending
 */


const adminSchema = mongoose.Schema({
  adminId: {
    type: String,
    required: true
  },
  password: {
    type:String,
    required: true
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - adminId
 *         - password
 *       properties:
 *         adminId:
 *           type: string
 *           description: The ID of the admin
 *           required: true
 *         password:
 *           type: string
 *           description: The password of the admin
 *           required: true
 */



function generateOrderId() {
  // Generate a random number between 1000 and 9999
  return Math.floor(1000 + Math.random() * 9000);
}

function generateConnectionId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const dateString = `${year}${month}${day}${hours}${minutes}${seconds}`;
  return parseInt(dateString.substring(2), 10); // Take the last 6 digits
}

const userModel = mongoose.model("user",userSchema)
const connModel = mongoose.model("newconnection", connSchema);
const dbModel = mongoose.model("db",dbSchema);
const orderModel = mongoose.model("order",orderSchema);
const complaintModel = mongoose.model("complaint",complaintSchema);
const adminModel=mongoose.model("admin",adminSchema)


const obj={value:'xyz',name:'Account'};

function updateObj(x,nam){
    obj.value=x;
    obj.name=nam;
}

const obj2={name:'name',email:'xyz',number:'1323',area:'dkjs'};

function updateObj2(nam,email,no,address){
  obj2.name=nam;
  obj2.email=email;
  obj2.number=no;
  obj2.area=address;
}


// class HttpError extends Error {
//   constructor(message, errorCode) {
//     super(message); 
//     this.code = errorCode; 
//   }
// }

// module.exports = HttpError;
// app.use((req, res, next) => {
//   const error = new HttpError('Could not find this route.', 404);
//   throw error;
// });
const myLog = function(req,res,next){
  console.log("Successful Signin")
  next()
}

const myLog1 = function(req,res,next){
  console.log("Successful Signup")
  next()
}
app.get("/",(req, res) => {
  res.send("Server is running");
});

/**
 * @swagger
 * paths:
 *   /:
 *     get:
 *       summary: Get server status
 *       description: Retrieve the status of the server.
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             text/plain:
 *               schema:
 *                 type: string
 *                 example: Server is running
 */


app.post("/signup",myLog1, async (req, res) => {
  console.log(req.body);
  const { email, phone } = req.body;

  const emailExists = await userModel.findOne({ email: email });
  const phoneExists = await userModel.findOne({ phone: phone });
  if (!emailExists && !phoneExists) {
    const newUser = userModel(req.body);
    const save = await newUser.save();
    res.send({ message: "Successfully sign up", alert: true });
  } else {
    let message = "";
    if (emailExists) {
      message += "Email id is already present. ";
    }
    if (phoneExists) {
      message += "Phone number is already present.";
    }
    res.send({ message: message, alert: false });
  }
});

/**
 * @swagger
 * paths:
 *   /signup:
 *     post:
 *       summary: User Signup
 *       description: Register a new user.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user.
 *                 phone:
 *                   type: integer
 *                   description: The phone number of the user.
 *               required:
 *                 - email
 *                 - phone
 *       responses:
 *         '200':
 *           description: Successful signup
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *                     example: Successfully sign up
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: true
 *         '400':
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                     example: Email id is already present.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */


app.post("/dbregister",fileUpload.single('document'), async (req, res) => {
  console.log(req.body);
  const { email, phone } = req.body;
  const documentpath=req.file.path;

  const updatedObject={...req.body,document:documentpath};

  const emailExists = await dbModel.findOne({ email: email });
  const phoneExists = await dbModel.findOne({ phone: phone });
  if (!emailExists && !phoneExists) {
    const newdb = dbModel(updatedObject);
    const save = await newdb.save();
    res.send({ message: "Wait for Admins Approval", alert: true });
  } else {
    let message = "";
    if (emailExists) {
      message += "Email id is already present. ";
    }
    if (phoneExists) {
      message += "Phone number is already present.";
    }
    res.send({ message: message, alert: false });
  }
});


/**
 * @swagger
 * paths:
 *   /dbregister:
 *     post:
 *       summary: Register User in Database
 *       description: Register a new user in the database with document upload.
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user.
 *                 phone:
 *                   type: integer
 *                   description: The phone number of the user.
 *                 document:
 *                   type: string
 *                   format: binary
 *                   description: The document to be uploaded.
 *       responses:
 *         '200':
 *           description: Successful registration
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *                     example: Wait for Admins Approval
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: true
 *         '400':
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */



app.post("/newconnection", fileUpload.single('document'),async (req, res) => {
  console.log(req.body);
  const { aadhar } = req.body;
  const { email, phone } = req.body;
  const documentpath=req.file.path;
  const updatedObject={...req.body,document:documentpath};


  const aadharExists = await connModel.findOne({ aadhar : aadhar });
  const emailExists = await connModel.findOne({ email: email });
  const phoneExists = await connModel.findOne({ phone: phone });

  if (!aadharExists && !phoneExists && !emailExists) {
    const newconn = connModel(updatedObject);
    const save = await newconn.save();
    res.send({ message: "Your Connection status is pending ", alert: true , connectionId: save.connectionId});
  } else {
    let message = "";
    if (aadharExists) {
      message += "Aadhar number already exists.";
    }
    if (emailExists && phoneExists) {
      message += "You have already registered for new connection";
    }
   
    res.send({ message: message, alert: false });
  }
});

/**
 * @swagger
 * paths:
 *   /newconnection:
 *     post:
 *       summary: Register New Connection
 *       description: Register a new connection with document upload.
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 aadhar:
 *                   type: integer
 *                   description: The Aadhar number of the user.
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user.
 *                 phone:
 *                   type: integer
 *                   description: The phone number of the user.
 *                 document:
 *                   type: string
 *                   format: binary
 *                   description: The document to be uploaded.
 *       responses:
 *         '200':
 *           description: Connection registration successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *                     example: Your Connection status is pending
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: true
 *                   connectionId:
 *                     type: string
 *                     description: The ID of the new connection.
 *         '400':
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */


app.post("/signin",myLog, async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  const { password } = req.body;
  const data = await userModel.findOne({ email: email });
  if (data) {
    if (data.password === password) {
      // console.log(data)
      const datasend = {
        _id: data._id,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        //   password: data.password,
        //   confirmPassword: data.confirmPassword,
      };
      updateObj(email, data.fullName);
      console.log(obj)
      console.log(datasend);
      res.send({
        message: "Login is successfull",
        alert: true,
        data: datasend,
        
      });
    } else {
      res.send({ message: "Enter correct password" });
    }
  } else {
    // res.send({
    //   message: "Email id is unavailable, Please signup",
    //   alert: false,
    // });
    // const error = new HttpError('Invalid credentials, could not log you in.', 403);
    // return next(error);

  }
});


/**
 * @swagger
 * paths:
 *   /signin:
 *     post:
 *       summary: User Signin
 *       description: Sign in with email and password.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user.
 *                 password:
 *                   type: string
 *                   format: password
 *                   description: The password of the user.
 *               required:
 *                 - email
 *                 - password
 *       responses:
 *         '200':
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *                     example: Login is successfull
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: true
 *                   data:
 *                     type: object
 *                     description: User data.
 *         '400':
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */



app.post("/dblogin", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  const { password } = req.body;
  const data = await dbModel.findOne({ email: email });
  if (data) {
    if (data.password === password) {
      
      console.log(data)
      const datasend = {
        _id: data._id,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        area : data.area,
        //   password: data.password,
        //   confirmPassword: data.confirmPassword,
      };
      updateObj2(data.fullName,data.email,data.phone,data.area);
      console.log(obj2)
    
      console.log(datasend);
      res.send({
        message: "Login is successfull",
        alert: true,
        data: datasend,
        
      });
    } else {
      res.send({ message: "Enter correct password" });
    }
  } else {
    res.send({
      message: "Email id is unavailable, Please signup",
      alert: false,
    });
  }
});


/**
 * @swagger
 * paths:
 *   /dblogin:
 *     post:
 *       summary: Database User Login
 *       description: Login for database users with email and password.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user.
 *                 password:
 *                   type: string
 *                   format: password
 *                   description: The password of the user.
 *               required:
 *                 - email
 *                 - password
 *       responses:
 *         '200':
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *                     example: Login is successfull
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: true
 *                   data:
 *                     type: object
 *                     description: User data.
 *         '400':
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 *         '404':
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */



app.get('/api/db', async (req, res) => {
  try {
    const dbEmail = obj2.email; 
    const dbArea = obj2.area;
    const connections = await connModel.find({ area:dbArea}).select('_id');

    const connectionIds = connections.map(connection => connection._id);

    const data = await orderModel.find({ connection: { $in: connectionIds } , status:"pending" }).populate('connection').exec();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * paths:
 *   /api/db:
 *     get:
 *       summary: Get Pending Orders in Database
 *       description: Retrieve pending orders associated with the logged-in user's area.
 *       responses:
 *         '200':
 *           description: Successful retrieval
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the order.
 *                     connection:
 *                       type: object
 *                       description: Information about the connection associated with the order.
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The ID of the connection.
 *                           example: 605d605fcb3d6779f8db5c7d
 *                         fullName:
 *                           type: string
 *                           description: The full name of the connection holder.
 *                           example: John Doe
 *                         phone:
 *                           type: number
 *                           description: The phone number of the connection holder.
 *                           example: 1234567890
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: The email address of the connection holder.
 *                           example: johndoe@example.com
 *                         aadhar:
 *                           type: number
 *                           description: The Aadhar number of the connection holder.
 *                           example: 123456789012
 *                         gender:
 *                           type: string
 *                           description: The gender of the connection holder.
 *                           example: Male
 *                         dob:
 *                           type: string
 *                           format: date-time
 *                           description: The date of birth of the connection holder.
 *                           example: 1990-01-01T00:00:00Z
 *                         address:
 *                           type: string
 *                           description: The address of the connection holder.
 *                           example: 123 Main Street
 *                         area:
 *                           type: string
 *                           description: The area of the connection holder.
 *                           example: Downtown
 *                         document:
 *                           type: string
 *                           description: The document path of the connection holder.
 *                           example: /uploads/document.pdf
 *                         connectionId:
 *                           type: string
 *                           description: The ID of the connection.
 *                           example: 1001
 *                         status:
 *                           type: string
 *                           description: The status of the connection.
 *                           example: pending
 *                     type:
 *                       type: string
 *                       description: The type of the order.
 *                       example: Installation
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp of the order.
 *                       example: 2024-04-27T12:00:00Z
 *                     status:
 *                       type: string
 *                       description: The status of the order.
 *                       example: pending
 *         '500':
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */


app.get('/api/data', async (req, res) => {
  try {
    const data = await connModel.find({email: obj.value});
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


/**
 * @swagger
 * paths:
 *   /api/data:
 *     get:
 *       summary: Get User Data
 *       description: Retrieve user data based on the provided email.
 *       responses:
 *         '200':
 *           description: Successful retrieval
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the user.
 *                     fullName:
 *                       type: string
 *                       description: The full name of the user.
 *                       example: John Doe
 *                     phone:
 *                       type: number
 *                       description: The phone number of the user.
 *                       example: 1234567890
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The email address of the user.
 *                       example: johndoe@example.com
 *                     aadhar:
 *                       type: number
 *                       description: The Aadhar number of the user.
 *                       example: 123456789012
 *                     gender:
 *                       type: string
 *                       description: The gender of the user.
 *                       example: Male
 *                     dob:
 *                       type: string
 *                       format: date-time
 *                       description: The date of birth of the user.
 *                       example: 1990-01-01T00:00:00Z
 *                     address:
 *                       type: string
 *                       description: The address of the user.
 *                       example: 123 Main Street
 *                     area:
 *                       type: string
 *                       description: The area of the user.
 *                       example: Downtown
 *                     document:
 *                       type: string
 *                       description: The document path of the user.
 *                       example: /uploads/document.pdf
 *                     connectionId:
 *                       type: string
 *                       description: The ID of the user's connection.
 *                       example: 1001
 *                     status:
 *                       type: string
 *                       description: The status of the user's connection.
 *                       example: pending
 *         '500':
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */



app.post("/booking", async (req, res) => {
  console.log(req.body);
 
    const neworder = orderModel(req.body);
    const save = await neworder.save();
    res.send({ message: "Order placed Successfully", alert: true , orderId: save.orderId,timestamp: save.timestamp});

  }
);


/**
 * @swagger
 * paths:
 *   /booking:
 *     post:
 *       summary: Place Booking Order
 *       description: Place a booking order.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 connection:
 *                   type: string
 *                   description: The ID of the connection.
 *                   example: 605d605fcb3d6779f8db5c7d
 *                 type:
 *                   type: string
 *                   description: The type of the order.
 *                   example: Installation
 *               required:
 *                 - connection
 *                 - type
 *       responses:
 *         '200':
 *           description: Order placed successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *                     example: Order placed Successfully
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: true
 *                   orderId:
 *                     type: string
 *                     description: The ID of the order.
 *                     example: 1001
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the order.
 *                     example: 2024-04-27T12:00:00Z
 *         '500':
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */



app.post("/complaint", async (req, res) => {
  console.log(req.body);
 
    const newcomplaint = complaintModel(req.body);
    const save = await newcomplaint.save();
    res.send({ message: "Complaint Registered Successfully", alert: true , complaintId: save.complaintId,timestamp: save.timestamp});
  }
);

/**
 * @swagger
 * paths:
 *   /complaint:
 *     post:
 *       summary: Register Complaint
 *       description: Register a new complaint.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 connection:
 *                   type: string
 *                   description: The ID of the connection associated with the complaint.
 *                   example: 605d605fcb3d6779f8db5c7d
 *                 type:
 *                   type: string
 *                   description: The type of the complaint.
 *                   example: Service Disruption
 *               required:
 *                 - connection
 *                 - type
 *       responses:
 *         '200':
 *           description: Complaint registered successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *                     example: Complaint Registered Successfully
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: true
 *                   complaintId:
 *                     type: string
 *                     description: The ID of the complaint.
 *                     example: 1001
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the complaint registration.
 *                     example: 2024-04-27T12:00:00Z
 *         '500':
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */



app.get('/api/history', async (req, res) => {
  try {
    const userEmail = obj.value; 
    const connections = await connModel.find({ email: userEmail }).select('_id');

    const connectionIds = connections.map(connection => connection._id);

    const data = await orderModel.find({ connection: { $in: connectionIds } }).populate('connection').exec();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


/**
 * @swagger
 * paths:
 *   /api/history:
 *     get:
 *       summary: Get Order History
 *       description: Retrieve order history for the logged-in user.
 *       responses:
 *         '200':
 *           description: Successful retrieval
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the order.
 *                     connection:
 *                       type: object
 *                       description: Information about the connection associated with the order.
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The ID of the connection.
 *                           example: 605d605fcb3d6779f8db5c7d
 *                         fullName:
 *                           type: string
 *                           description: The full name of the connection holder.
 *                           example: John Doe
 *                         phone:
 *                           type: number
 *                           description: The phone number of the connection holder.
 *                           example: 1234567890
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: The email address of the connection holder.
 *                           example: johndoe@example.com
 *                         aadhar:
 *                           type: number
 *                           description: The Aadhar number of the connection holder.
 *                           example: 123456789012
 *                         gender:
 *                           type: string
 *                           description: The gender of the connection holder.
 *                           example: Male
 *                         dob:
 *                           type: string
 *                           format: date-time
 *                           description: The date of birth of the connection holder.
 *                           example: 1990-01-01T00:00:00Z
 *                         address:
 *                           type: string
 *                           description: The address of the connection holder.
 *                           example: 123 Main Street
 *                         area:
 *                           type: string
 *                           description: The area of the connection holder.
 *                           example: Downtown
 *                         document:
 *                           type: string
 *                           description: The document path of the connection holder.
 *                           example: /uploads/document.pdf
 *                         connectionId:
 *                           type: string
 *                           description: The ID of the connection.
 *                           example: 1001
 *                         status:
 *                           type: string
 *                           description: The status of the connection.
 *                           example: pending
 *                     type:
 *                       type: string
 *                       description: The type of the order.
 *                       example: Installation
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp of the order.
 *                       example: 2024-04-27T12:00:00Z
 *                     status:
 *                       type: string
 *                       description: The status of the order.
 *                       example: pending
 *         '500':
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */


app.get('/api/comphistory', async (req, res) => {
  try {
    const userEmail = obj.value; 
    const connections = await connModel.find({ email: userEmail }).select('_id');

    const connectionIds = connections.map(connection => connection._id);

    const data = await complaintModel.find({ connection: { $in: connectionIds } }).populate('connection').exec();
console.log(obj.value)
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


/**
 * @swagger
 * paths:
 *   /api/comphistory:
 *     get:
 *       summary: Get Complaint History
 *       description: Retrieve complaint history for the logged-in user.
 *       responses:
 *         '200':
 *           description: Successful retrieval
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the complaint.
 *                     connection:
 *                       type: object
 *                       description: Information about the connection associated with the complaint.
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The ID of the connection.
 *                           example: 605d605fcb3d6779f8db5c7d
 *                         fullName:
 *                           type: string
 *                           description: The full name of the connection holder.
 *                           example: John Doe
 *                         phone:
 *                           type: number
 *                           description: The phone number of the connection holder.
 *                           example: 1234567890
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: The email address of the connection holder.
 *                           example: johndoe@example.com
 *                         aadhar:
 *                           type: number
 *                           description: The Aadhar number of the connection holder.
 *                           example: 123456789012
 *                         gender:
 *                           type: string
 *                           description: The gender of the connection holder.
 *                           example: Male
 *                         dob:
 *                           type: string
 *                           format: date-time
 *                           description: The date of birth of the connection holder.
 *                           example: 1990-01-01T00:00:00Z
 *                         address:
 *                           type: string
 *                           description: The address of the connection holder.
 *                           example: 123 Main Street
 *                         area:
 *                           type: string
 *                           description: The area of the connection holder.
 *                           example: Downtown
 *                         document:
 *                           type: string
 *                           description: The document path of the connection holder.
 *                           example: /uploads/document.pdf
 *                         connectionId:
 *                           type: string
 *                           description: The ID of the connection.
 *                           example: 1001
 *                         status:
 *                           type: string
 *                           description: The status of the connection.
 *                           example: pending
 *                     type:
 *                       type: string
 *                       description: The type of the complaint.
 *                       example: Service Disruption
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp of the complaint.
 *                       example: 2024-04-27T12:00:00Z
 *                     status:
 *                       type: string
 *                       description: The status of the complaint.
 *                       example: pending
 *         '500':
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */



app.post('/update-status', async (req, res) => {
  const id = req.body.orderId;

  try {
      // Update the order status to 'completed' using updateOne
      await orderModel.updateOne({ orderId: id }, { status: 'completed' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      res.send({ message: "Order placed Successfully", alert: true,pendingOrders});
  }
});

/**
 * @swagger
 * paths:
 *   /update-status:
 *     post:
 *       summary: Update Order Status
 *       description: Update the status of an order to 'completed'.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: string
 *                   description: The ID of the order to be updated.
 *                   example: 605d605fcb3d6779f8db5c7d
 *               required:
 *                 - orderId
 *       responses:
 *         '200':
 *           description: Order status updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *                     example: Order status updated successfully
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: true
 *         '500':
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message.
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */




app.get('/api/dbstats', async (req, res) => {
  try {
    const dbEmail = obj2.email; 
    const dbArea = obj2.area;
    const connections = await connModel.find({ area:dbArea}).select('_id');

    const connectionIds = connections.map(connection => connection._id);

    const data = await orderModel.find({ connection: { $in: connectionIds } }).populate('connection').exec();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * paths:
 *   /api/dbstats:
 *     get:
 *       summary: Get Database Statistics
 *       description: Retrieve statistics related to the database for the logged-in user.
 *       responses:
 *         '200':
 *           description: Successful retrieval
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the order.
 *                     connection:
 *                       type: object
 *                       description: Information about the connection associated with the order.
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The ID of the connection.
 *                           example: 605d605fcb3d6779f8db5c7d
 *                         fullName:
 *                           type: string
 *                           description: The full name of the connection holder.
 *                           example: John Doe
 *                         phone:
 *                           type: number
 *                           description: The phone number of the connection holder.
 *                           example: 1234567890
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: The email address of the connection holder.
 *                           example: johndoe@example.com
 *                         aadhar:
 *                           type: number
 *                           description: The Aadhar number of the connection holder.
 *                           example: 123456789012
 *                         gender:
 *                           type: string
 *                           description: The gender of the connection holder.
 *                           example: Male
 *                         dob:
 *                           type: string
 *                           format: date-time
 *                           description: The date of birth of the connection holder.
 *                           example: 1990-01-01T00:00:00Z
 *                         address:
 *                           type: string
 *                           description: The address of the connection holder.
 *                           example: 123 Main Street
 *                         area:
 *                           type: string
 *                           description: The area of the connection holder.
 *                           example: Downtown
 *                         document:
 *                           type: string
 *                           description: The document path of the connection holder.
 *                           example: /uploads/document.pdf
 *                         connectionId:
 *                           type: string
 *                           description: The ID of the connection.
 *                           example: 1001
 *                         status:
 *                           type: string
 *                           description: The status of the connection.
 *                           example: pending
 *                     type:
 *                       type: string
 *                       description: The type of the order.
 *                       example: Installation
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp of the order.
 *                       example: 2024-04-27T12:00:00Z
 *                     status:
 *                       type: string
 *                       description: The status of the order.
 *                       example: pending
 *         '500':
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *                   alert:
 *                     type: boolean
 *                     description: Indicates if an alert should be shown.
 *                     example: false
 */



app.post('/send-otp', (req, res) => {
  const { email2 } = req.body;
  console.log(email2)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email2] = otp;

  const mailOptions = {
    from: 'kakarlasivasai043@gmail.com',
    to: email2,
    subject: 'OTP Verification',
    text: `Your OTP for sign up is: ${otp}`,
  };

  mailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'OTP sent successfully' });
    }
  });
});

/**
 * @swagger
 * paths:
 *   /send-otp:
 *     post:
 *       summary: Send OTP for Email Verification
 *       description: Sends an OTP (One-Time Password) for email verification.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email2:
 *                   type: string
 *                   format: email
 *                   description: The email address to which the OTP will be sent.
 *                   example: example@example.com
 *               required:
 *                 - email2
 *       responses:
 *         '200':
 *           description: OTP sent successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *                     example: OTP sent successfully
 *         '500':
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message.
 *                   message:
 *                     type: string
 *                     description: Error message.
 */



app.post('/verify-otp', (req, res) => {
  const { email2, otp } = req.body;
  const storedOtp = otpStore[email2];
  console.log(storedOtp)
  console.log(otp)

  if (storedOtp && storedOtp === otp) {
    res.status(200).json({ message: 'OTP verified successfully' });
   
    // You can implement user registration logic here
    
  } else {
    res.status(401).json({ error: 'Invalid OTP' });
  }
});


/**
 * @swagger
 * paths:
 *   /verify-otp:
 *     post:
 *       summary: Verify OTP
 *       description: Verifies the OTP (One-Time Password) for email verification.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email2:
 *                   type: string
 *                   format: email
 *                   description: The email address for which the OTP was sent.
 *                   example: example@example.com
 *                 otp:
 *                   type: string
 *                   description: The OTP received for verification.
 *                   example: 123456
 *               required:
 *                 - email2
 *                 - otp
 *       responses:
 *         '200':
 *           description: OTP verified successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *                     example: OTP verified successfully
 *         '401':
 *           description: Invalid OTP
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message.
 *                   message:
 *                     type: string
 *                     description: Error message.
 */



app.get('/user/:userId/document', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await connModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const documentPath = user.documentPath; 

    const serverURL = 'http://localhost:8080'; 
    const documentURL = `${serverURL}/${documentPath}`;

    res.status(200).json({ documentURL });
  } catch (error) {
    console.error('Error retrieving document:', error);
    res.status(500).json({ message: 'Error retrieving document' });
  }
});


/**
 * @swagger
 * paths:
 *   /user/{userId}/document:
 *     get:
 *       summary: Get User Document
 *       description: Retrieves the document associated with the specified user.
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the user.
 *       responses:
 *         '200':
 *           description: Document URL retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   documentURL:
 *                     type: string
 *                     format: uri
 *                     description: The URL of the user's document.
 *                     example: http://localhost:8080/uploads/document.pdf
 *         '404':
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 *         '500':
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message.
 */



app.post("/adminlogin", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  const { password } = req.body;
  const data = await adminModel.findOne({ adminId : email });
  if (data) {
    if (data.password === password) {
      
      console.log(data)
      const datasend = {
        _id: data._id,
        email: data.email,
      };
      res.send({
        message: "Login is successfull",
        alert: true,
        data: datasend,
        
      });
    } else {
      res.send({ message: "Enter correct password" });
    }
  } else {
    res.send({
      message: "Email id is unavailable, Enter correct Email",
      alert: false,
    });
  }
});




app.get('/api/admintable', async (req, res) => {
  try {
    const connections = await connModel.find().select('_id');

    const connectionIds = connections.map(connection => connection._id);

    const data = await orderModel.find({ connection: { $in: connectionIds } }).populate('connection').exec();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


app.get('/api/datas', async (req, res) => {
  try {
    const connections = await connModel.find().select('_id');

    const connectionIds = connections.map(connection => connection._id);

    const data = await orderModel.find({ connection: { $in: connectionIds } }).populate('connection').exec();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/connectiondatas', async (req, res) => {
  try {
    const data = await connModel.find()
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


app.get('/complaintdata', async (req, res) => {
  try {
    const data = await complaintModel.find()
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/approvedb', async (req, res) => {
  try {
    const data = await dbModel.find({status:"pending"})
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/approvedb', async (req, res) => {
  const id = req.body.emailId;

  try {
      // Update the order status to 'completed' using updateOne
      await dbModel.updateOne({ email: id }, { status: 'completed' })
      .then(async function(){
        let deliveryboy= await dbModel.find({email:id});
        if(deliveryboy!==null)
        {
            email=deliveryboy[0].email;
            const mailOptions = {
                from: 'kakarlasivasai043@gmail.com',
                to: email,
                subject:"Regarding your confirmation",
                text: "Your request has been approved by F1 gas agency"
            };
            mailTransporter.sendMail(mailOptions)
                .then((info) => {
                    console.log(`Email sent: ${info.response}`);
                })
                .catch((error) => {
                    console.log(`Error occurred while sending email: ${error}`);
                    res.send('Email not sent');
                });
      }
      })
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      res.send({ message: "db Approved Successfully", alert: true,pendingOrders});
  }

});


app.get('/approveconn', async (req, res) => {
  try {
    const data = await connModel.find({status:"pending"})
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/api/getuserdetails',async (req, res) => {
  try {
    const data = await connModel.find()
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/api/getdbdetails',async (req, res) => {
  try {
    const data = await dbModel.find()
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


app.post('/approveconn', async (req, res) => {
  const id = req.body.connId;

  try {
      // Update the order status to 'completed' using updateOne
      await connModel.updateOne({ connectionId: id }, { status: 'completed' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      res.send({ message: "db Approved Successfully", alert: true,pendingOrders});
  }

});



app.get('/approvecom', async (req, res) => {
  try {
    const connections = await connModel.find().select('_id');

    const connectionIds = connections.map(connection => connection._id);

    const data = await complaintModel.find({ connection: { $in: connectionIds },status: 'pending' }).populate('connection').exec();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/approvecom', async (req, res) => {
  const id = req.body.comId;

  try {
      // Update the order status to 'completed' using updateOne
      await complaintModel.updateOne({ complaintId: id }, { status: 'completed' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      res.send({ message: "db Approved Successfully", alert: true,pendingOrders});
  }

});

app.post('/remainders',async (req,res) => {
  const { subject, message } = req.body;
  try{
    const users = await userModel.find();
    const emailList = users.map(user => user.email);

    const mailOptions = {
      from: 'kakarlasivasai043@gmail.com',
      to: emailList.join(','),
      subject: subject,
      text: message
    };
    mailTransporter.sendMail(mailOptions)
    .then((info) => {
      console.log(`Email sent: ${info.response}`);
      res.status(200).send('Email sent successfully');
    })
    .catch((error) => {
      console.log(`Error occurred while sending email: ${error}`);
      res.status(500).send('Error sending email');
    });
  }
  catch (error) {
    console.log(`Error occurred while finding users: ${error}`);
    res.status(500).send('Error finding users');
  }
});
  

app.get('/dbdatas', async (req, res) => {
  try {
    const data = await dbModel.find({status:'completed'})
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/api/updateuser', async (req, res) => {

  const { userId, fullName, phone , area,address } = req.body;

  try {
      // Find the user by userId
      const user = await connModel.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update name and phone number fields
      user.fullName = fullName;
      user.phone = phone;
      user.area = area;
      user.address = address;
      // Save the updated user details
      await user.save();

      return res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/deleteuser/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const deletedUser = await connModel.findByIdAndDelete(userId);
      if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/api/updatedb', async (req, res) => {

  const { userId, fullName, phone,area } = req.body;

  try {
      // Find the user by userId
      const user = await dbModel.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update name and phone number fields
      user.fullName = fullName;
      user.phone = phone;
      user.area = area;

      // Save the updated user details
      await user.save();

      return res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/deletedb/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const deletedUser = await dbModel.findByIdAndDelete(userId);
      if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/NotifyCustomer', async (req, res) => {
  try {
  const  emailid = req.body.emailId;
  const orderid  = req.body.orderId;
    const data = await orderModel.findOne({ orderId: orderid });
    if (data) {
        Type = data.type
      };
      

    const data1 = await userModel.findOne({ email: emailid });
    if (data1) {
        Custname = data1.fullName
        };

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'kakarlasivasai043@gmail.com',
        pass: 'svlfvkjzhatftelm'
      }
    });
    let info = await transporter.sendMail({
      from: 'kakarlasivasai043@gmail.com', 
      to: emailid, 
      subject: 'F1 Gas Agency - Notification', 
      text: `Dear ${Custname},\n\nWe are pleased to inform you that your order with ID ${orderid}, containing ${Type} kg of gas, is now out for delivery. Our team is diligently working to ensure your package reaches you shortly.\n\nThank you for choosing F1 gas booking agency. We appreciate your business and hope you have a delightful experience with us.\n\nBest regards,\nF1 gas
      `
    }); 

    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/dbhistory', async (req, res) => {
  try {
    const area = obj2.area; 
    

    const data = await orderModel.find({status:"complete"})

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


//server is ruuning
app.listen(Port, () => console.log("server is running at port : " + Port));


