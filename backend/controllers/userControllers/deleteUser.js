import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

export const deleteUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.email === "admin@gmail.com") {
            res.status(400).send({ message: "Can't Delete Admin User" });
            return;
        }
        await user.remove();
        res.send({ message: "User Deleted" });
    } else {
        res.status(404).send({ message: "User Not Found" });
    }
})
