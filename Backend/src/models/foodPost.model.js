import client from "../database/connectDB.js";
import { handleImageDeletion } from "../utils/amazonS3.utils.js";
import toCamelCase from "../utils/toCamelCase.js";
const createFoodPostTable = `
CREATE TABLE IF NOT EXISTS food_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT[],
    dietary_restrictions TEXT,
    location TEXT NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    availability_status VARCHAR(50) NOT NULL,
    expiration_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;


const FoodPost = {

    /**
     * Create a new food post
     * @param userId
     * @param title
     * @param quantity
     * @param description
     * @param imageUrl
     * @param dietaryRestrictions
     * @param location
     * @param availabilityStatus
     * @param expirationDate
     * @returns {Promise<*>}
     */
    async create({
        userId,
        title,
        quantity,
        description,
        imageUrl,
        dietaryRestrictions,
        location,
        availabilityStatus,
        expirationDate,
                 }) {
        try {
            // geocode api key
            const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
            const createdAt = new Date();
            // Fetch the latitude and longitude of the location, using api
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${GEOCODE_API_KEY}&language=en&pretty=1`);
            const data = await response.json();
            const latitude = data.results[0].bounds.northeast.lat;
            const longitude = data.results[0].bounds.northeast.lng;

            const { rows } = await client.query(`
                INSERT INTO food_posts (
                    user_id,
                    title,
                    quantity,
                    description,
                    image_url,
                    dietary_restrictions,
                    location,
                    latitude,
                    longitude,
                    availability_status,
                    expiration_date,
                    created_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *;
            `, [
                userId,
                title,
                quantity,
                description,
                imageUrl,
                dietaryRestrictions,
                location,
                latitude,
                longitude,
                availabilityStatus,
                expirationDate,
                createdAt
            ]);
            return toCamelCase(rows[0]);
        }
        catch (error) {
            console.log("Error in create food post", error);
            throw error;
        }
    },

    /**
     * Find food post by foodPostId
     * @param foodPostId
     * @returns {Promise<*|{success: boolean, message: string}>}
     */
    async findById(foodPostId) {
        try {
            const { rows } = await client.query('SELECT * FROM food_posts WHERE id = $1', [foodPostId]);
            return toCamelCase(rows[0]);
        }
        catch (error) {
            console.log("Error in find food post by id", error);
            throw error;
        }
    },

    /**
     * Find all food posts
     * @returns {Promise<*>}
     */
    async findAll() {
        try {
            const { rows } = await client.query('SELECT * FROM food_posts');

            //camel case the rows
            return rows.map(toCamelCase);
        }
        catch (error) {
            console.log("Error in find all food posts", error);
            throw error;
        }
    },

    /**
     * Find food posts by userId
     * @param id
     * @param title
     * @param quantity
     * @param description
     * @param imageUrl
     * @param dietaryRestrictions
     * @param location
     * @param availabilityStatus
     * @param expirationDate
     * @returns {Promise<*>}
     */
    async updateById(id, {
        title,
        quantity,
        description,
        imageUrl,
        dietaryRestrictions,
        location,
        availabilityStatus,
        expirationDate,
    }) {
        try {
            const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
            const createdAt = new Date();
            // Fetch the latitude and longitude of the location, using api
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${GEOCODE_API_KEY}&language=en&pretty=1`);
            const data = await response.json();
            const latitude = data.results[0].bounds.northeast.lat;
            const longitude = data.results[0].bounds.northeast.lng;
            const { rows } = await client.query(`
                UPDATE food_posts SET
                    title = $1,
                    quantity = $2,
                    description = $3,
                    image_url = $4,
                    dietary_restrictions = $5,
                    location = $6,
                    latitude = $7,
                    longitude = $8,
                    availability_status = $9,
                    expiration_date = $10
                WHERE id = $11
                RETURNING *;
            `, [title, quantity, description, imageUrl, dietaryRestrictions, location, latitude, longitude, availabilityStatus, expirationDate, id]);
            return toCamelCase(rows[0]);
        }
        catch (error) {
            console.log("Error in update food post by id", error);
            throw error;
        }
    },

    /**
     * Delete food post by id
     * @param id
     * @returns {Promise<*>}
     */
    async deleteById(id) {
        try {
            const { rows } = await client.query('DELETE FROM food_posts WHERE id = $1', [id]);
            return rows[0];
        }
        catch (error) {
            console.log("Error in delete food post by id", error);
            throw error;
        }
    },
}

export { createFoodPostTable, FoodPost };
