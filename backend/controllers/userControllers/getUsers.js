import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js"; 

const PAGE_SIZE = 6;

export const getUsers = expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const users = await User.find({})
        .skip(pageSize * (page - 1))
        .limit(pageSize);

    const countUsers = await User.countDocuments();

    res.send({
        users,
        countUsers,
        page,
        pages: Math.ceil(countUsers / pageSize),
    });
})