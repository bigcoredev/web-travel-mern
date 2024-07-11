import asyncHandler from 'express-async-handler'
import Post from '../models/postModel.js';
import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';
import Faq from '../models/faqModel.js';

//@description     Fetch top 5 commented posts
//@route           GET /api/admin/top_posts
//@access          Protected
const fetchTopPosts = asyncHandler(async (req, res) => {
  try {
    const results = await Post.find({}).populate("sender").populate("reviews.user").sort("-reviews").limit(5);
    //    const results = await Post.find({createdAt: '2024-06-20T09:37:34.547+00:00'}).populate("sender").populate("reviews.user");
    if(results)
      res.status(200).send({message: results, state: "OK"});
    else
      res.status(200).send({message: "", state: "NO"});
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Fetch today posts
//@route           POST /api/admin/posts
//@access          Protected
const fetchPosts = asyncHandler(async (req, res) => {
  try {
    const {today} = req.body;

    if(today!=="ALL"){
      const startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);

      const datePredicate = {'createdAt': {"$gte": startDate, "$lt": endDate}};
      const results = await Post.find(datePredicate).populate("sender").populate("reviews.user");
      if(results)
        res.status(200).send({message: results, state: "OK"});
      else
        res.status(200).send({message: "", state: "NO"});
    }
    else{
      const results = await Post.find({}).populate("sender").populate("reviews.user");
      if(results)
        res.status(200).send({message: results, state: "OK"});
      else
        res.status(200).send({message: "", state: "NO"});
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Fetch today chats
//@route           POST /api/admin/chats
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    const {today} = req.body;

    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);
    const datePredicate = {'createdAt': {"$gte": startDate, "$lt": endDate}};

    const results = await Chat.find(datePredicate).populate("users");
    if(results)
      res.status(200).send({message: results, state: "OK"});
    else
      res.status(200).send({message: "", state: "NO"});
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Fetch users this year
//@route           POST /api/admin/users
//@access          Protected
const fetchUsers = asyncHandler(async (req, res) => {
  try {
    const {today} = req.body;

    if(today!=="ALL"){
      const startDate = new Date(today);
      startDate.setMonth(1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(today);
      endDate.setMonth(12);
      endDate.setDate(31);
      endDate.setHours(23, 59, 59, 0);
      const datePredicate = {'createdAt': {"$gte": startDate, "$lt": endDate}};
      const results = await User.find(datePredicate);
      if(results)
        res.status(200).send({message: results, state: "OK"});
      else
        res.status(200).send({message: "", state: "NO"});
    }
    else{
      const results = await User.find({});
      if(results)
        res.status(200).send({message: results, state: "OK"});
      else
        res.status(200).send({message: "", state: "NO"});
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Fetch Faqs
//@route           GET /api/admin/faqs
//@access          Protected
const fetchFaqs = asyncHandler(async (req, res) => {
  try {
      const results = await Faq.find({});
      if(results)
        res.status(200).send({message: results, state: "OK"});
      else
        res.status(200).send({message: "", state: "NO"});
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Update And Fetch Faqs
//@route           POST /api/admin/update_faqs
//@access          Protected
const updateFaqs = asyncHandler(async (req, res) => {
  try {
    const {question1, answer1, question2, answer2, question3, answer3} = req.body;
    const faqs = [
      {
        "no": 1,
        "question": question1,
        "answer": answer1,
      },
      {
        "no": 2,
        "question": question2,
        "answer": answer2,
      },
      {
        "no": 3,
        "question": question3,
        "answer": answer3,
      },
    ];

    await Faq.deleteMany();
    await Faq.insertMany(faqs);

    const results = await Faq.find({});
    if(results)
      res.status(200).send({message: results, state: "OK"});
    else
      res.status(200).send({message: "", state: "NO"});
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export {
  fetchTopPosts,
  fetchPosts,
  fetchChats,
  fetchUsers,
  fetchFaqs,
  updateFaqs,
};
