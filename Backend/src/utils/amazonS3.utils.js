import client from "../database/connectDB.js";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();
// Configure S3

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

async function handleImageUpload(req) {
  const files = req?.files;
  // return error if no files are available
  if (!files) {
    return { success: false, message: "No files have been sent" };
  }
  // UserID
  const userID = req.userID;

  try {
    // array to store all image links
    const imageUrls = [];
    // loop through each file
    for (const file of files) {
      // add unique name for each
      const fileName = uuidv4() + "." + file.mimetype.split("/")[1];

      // Compress the image here (for efficient storage)

      // setup upload params
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        // user folder for each user
        Key: `user-uploads/${userID}/${fileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      // upload to s3
      const s3Response = await s3.upload(params).promise();
      // save to url array
      console.log("S3 Response:", s3Response.Key);

      // Setup signed url params
      const signedParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Response.Key,
      };

      // get the signed url
      const signedURL = await s3.getSignedUrlPromise("getObject", signedParams);

      // push to the urls array
      imageUrls.push(signedURL);

    }
    return {
      success: true,
      message: "Images uploaded sucessfully",
      urls: imageUrls,
    };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { success: false, message: "Image uploading error" };
  }
}

async function handleImageDeletion(images) {
  try {
    // function to delete all image objects
    for (const image of images) {
      // get the key after dotcom
      const imageURL = image.split(".com/")[1];
      // get only the path
      const imageKey = imageURL.split("?")[0];

      console.log("imageKey", imageKey);

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
      };

      // delete the object from s3
      await s3.deleteObject(params).promise();
    }
    console.log("All objects deleted for user in S3");
    return { status: "true", message: "All images deleted from S3" };
  } catch (error) {
    console.error("Error while generating image", error);
    return { "Error while generating image": error };
  }
}
// optional
async function handleImageUpdate(req) {}

export { handleImageUpload, handleImageDeletion };
