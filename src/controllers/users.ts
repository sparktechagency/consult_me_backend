import { Request, Response } from "express";
import { User } from "../schema";

const get_users = async (req: Request, res: Response) => {
  const { page, limit, query } = req.query;
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 10;
  const offset = (pageNumber - 1) * limitNumber;

  const users = await User.find(
    {
      role: "user",
      ...(query
        ? {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        }
        : {}),
    },
    { password_hash: 0, __v: 0, role: 0 }
  )
    .skip(offset)
    .limit(limitNumber)
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments({ role: "user" });
  const totalPages = Math.ceil(totalUsers / limitNumber);
  const response = {
    message: "Users fetched successfully",
    data: users,
    meta: {
      totalUsers,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    },
  };

  res.status(200).json(response);
};

const get_consultants = async (req: Request, res: Response) => {
  const { page, limit, query } = req.query;
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 10;
  const offset = (pageNumber - 1) * limitNumber;
  const users = await User.find(
    {
      role: "consultant",
      ...(query
        ? {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        }
        : {}),
    },
    { password_hash: 0, __v: 0, role: 0 }
  )
    .skip(offset)
    .limit(limitNumber)
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments({ role: "consultant" });
  const totalPages = Math.ceil(totalUsers / limitNumber);
  const response = {
    message: "Consultants fetched successfully",
    data: users,
    meta: {
      totalUsers,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    },
  };

  res.status(200).json(response);
};

const toggle_ban = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  const user = await User.findById(user_id, {
    name: 1,
    email: 1,
    account_status: 1,
  });

  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
    return;
  }

  user.account_status = user.account_status === "Banned" ? "Active" : "Banned";
  await user.save();

  const response = {
    message:
      user.account_status === "Banned"
        ? "User banned successfully"
        : "User unbanned successfully",
    data: user,
  };

  res.status(200).json(response);
};

export { get_users, get_consultants, toggle_ban };
