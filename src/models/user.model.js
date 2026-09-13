import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"
        ],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should contain atleast 6 characters"],
        select: false
    }
}, { timestamps: true });


userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const UserModel = mongoose.model("User", userSchema);