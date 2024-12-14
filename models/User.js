import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;