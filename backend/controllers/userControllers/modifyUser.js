import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js"; 
import { generateToken } from "../../utils.js";
import bcrypt from "bcryptjs";

export const modifyUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
        } else {
            user.password = user.password;
        }

        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser),
        });
    } else {
        res.status(404).send({ message: "User not found" });
    }
})