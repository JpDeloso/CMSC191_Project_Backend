import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    email: String,
    password: String
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;