const JWT_ADMIN_SECRET= process.env.JWT_ADMIN_SECRET;
const JWT_USER_SECRET= process.env.JWT_USER_SECRET;
const MONGO_URL = process.env.MONGO_URL;

module.exports={
    JWT_ADMIN_SECRET,
    JWT_USER_SECRET,
    MONGO_URL
}