import express from "express";
import { isAuth, isAdmin } from "../utils.js";
import { getUsers } from "../controllers/userControllers/getUsers.js";
import { getUser } from "../controllers/userControllers/getUser.js";
import { modifyUser } from "../controllers/userControllers/modifyUser.js";
import { modifyUserByAdmin } from "../controllers/userControllers/modifyUserByAdmin.js";
import { forgetPassword } from "../controllers/userControllers/forgetPassword.js";
import { resetPassword } from "../controllers/userControllers/resetPassword.js";
import { signinUser } from "../controllers/userControllers/signinUser.js";
import { signupUser } from "../controllers/userControllers/signupUser.js";
import { deleteUser } from "../controllers/userControllers/deleteUser.js";

const userRouter = express.Router();

userRouter.get("/", isAuth, isAdmin, getUsers);
userRouter.get("/:id", isAuth, isAdmin, getUser);
userRouter.put("/profile", isAuth, modifyUser);
userRouter.put("/:id", isAuth, isAdmin, modifyUserByAdmin);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/signin", signinUser);
userRouter.post("/signup", signupUser);
userRouter.delete("/:id", isAuth, isAdmin, deleteUser);

export default userRouter;
