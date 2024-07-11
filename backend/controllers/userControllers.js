import asyncHandler from 'express-async-handler'
import generateToken from '../config/generateToken.js';
import User from '../models/userModel.js';

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Get or Search all users
//@route           GET /api/user?id=
//@access          Public
const GetUserById = asyncHandler(async (req, res) => {  
  
  const user = await User.findById(req.params.id);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, firstname, lastname, email, password, pic, phone } = req.body;
 
  if (!name || !firstname || !lastname || !email || !password || !phone) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({name, firstname, lastname, email, password, phone, pic});

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     UPdate a user
//@route           PUT /api/user/update
//@access          Public
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
 
 
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.pic = req.body.pic || user.pic;

    // if (req.body.password) {
    //   user.password = req.body.password;
    // }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      phone: updatedUser.phone,
      email: updatedUser.email,
      pic: updatedUser.pic,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
 
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
//  console.log(email, password)
  const user = await User.findOne({ email });
// console.log(user)
// console.log(await user.matchPassword(password))
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

export { allUsers, registerUser, authUser, GetUserById, updateProfile };
