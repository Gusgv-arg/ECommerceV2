import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/userModel.js";

export const resetPassword = expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
            res.status(401).send({ message: "Invalid Token" });
        } else {
            const user = await User.findOne({ resetToken: req.body.token });
            if (user) {
                if (req.body.password) {
                    user.password = bcrypt.hashSync(req.body.password, 8);
                    await user.save();
                    res.send({
                        message: "Password reseted successfully",
                    });
                }
            } else {
                res.status(404).send({ message: "User not found" });
            }
        }
    });
})