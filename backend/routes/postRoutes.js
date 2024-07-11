import express from 'express'

import {
  fetchLocations,
  fetchPosts,
//  importLocations,
  submitPost,
  getPost,
  updatePost,
  explorePosts,
  changeLikedPost,
  changeCommentPost,
  notifyPost,
  notifyPost2,
  fetchNotifiedPosts,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/location").get(protect, fetchLocations);
//router.route("/location/import").post(protect, importLocations);
router.route("/submit").post(protect, submitPost);
router.route("/index").post(protect, fetchPosts);
router.route('/edit').post(protect, getPost);
router.route('/update').post(protect, updatePost);
router.route('/explore').post(protect, explorePosts);
router.route('/like_post').post(protect, changeLikedPost);
router.route('/comment_post').post(protect, changeCommentPost);
router.route("/notified_posts").post(protect, fetchNotifiedPosts);
router.route('/notify').post(protect, notifyPost);
router.route('/notify2').post(protect, notifyPost2);

export default router;
