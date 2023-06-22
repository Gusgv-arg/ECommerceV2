import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

export const modifyuserByAdmin = expressAsyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = Boolean(req.body.isAdmin);
		const updatedUser = await user.save();
		res.send({ message: "User Updated", user: updatedUser });
	} else {
		res.status(404).send({ message: "User Not Found" });
	}
});
