import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js"; 

export const getUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ message: "User Not Found" });
    }
})