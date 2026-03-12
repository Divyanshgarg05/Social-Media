import { Router } from "express";
import { activeCheck, get_comments_by_post,delete_comment_of_user,increment_likes } from "../controllers/posts.controller.js";

import { createPost , getAllPosts,deletePost,commentPost} from "../controllers/posts.controller.js";
import { get } from "mongoose";
import { upload } from "../config/cloudConfig.js";

const router = Router();






router.route('/').get(activeCheck);

router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increment_post_like").post(increment_likes);
export default router;

