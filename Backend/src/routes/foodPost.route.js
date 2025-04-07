import express from "express";
import {
    createFoodPost,
    deleteFoodPost,
    getFoodPost,
    getFoodPosts,
    updateFoodPost
} from '../controllers/foodPost.controller.js';
import {verifyToken} from "../middlewares/verifyToken.js";
import multer from "multer"



const router = express.Router();


// Setup multer
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// get all food posts
router.get('/', verifyToken, getFoodPosts);
// get post by id
router.get('/:id', verifyToken, getFoodPost);
// create new post
router.post('/', upload.array('images'), verifyToken, createFoodPost);
// update existing post
router.put('/:id', verifyToken, updateFoodPost);
// delete a post
router.delete('/:id', verifyToken, deleteFoodPost);

export default router;