import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";

import ConnectionRequest from "../models/connections.model.js";

const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.moveDown(10);

  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio || "N/A"}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost || "N/A"}`);

  doc.fontSize(14).text("Past Work: ");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name: ${work.company || "N/A"}`);
    doc.fontSize(14).text(`Position: ${work.Position || "N/A"}`);
    doc.fontSize(14).text(`Years: ${work.years || "N/A"}`);
  });

  doc.end();
  return outputPath;
};

export const register = async (req, res) => {
  // Registration logic here
  try {
    console.log("Register request body:", req.body);
    const { name, email, username, password } = req.body;
    // Validate input
    if (!name || !email || !username || !password) {
      console.log("Register validation failed - missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log("Register aborted - user already exists:", existingUser);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      username,
      Password: hashedPassword,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    console.log("User created:", newUser._id);
    return res.json({ message: "User Created Successfully" });
  } catch (error) {
    console.error("Register handler error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  // Login logic here
  try {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { $set: { token } });

    return res.json({ token: token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profilePicture = req.file.filename;
    await user.save();
    return res.json({ message: "Profile picture updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { username, email } = newUserData;

    // Only check for existing users if username or email are being updated
    if (username || email) {
      const queryConditions = [];
      if (username) queryConditions.push({ username });
      if (email) queryConditions.push({ email });

      const existingUser = await User.findOne({ $or: queryConditions });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }
    }

    Object.assign(user, newUserData);
    await user.save();
    return res.json({ message: "Profile updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );

    return res.json({ user: userProfile });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token: token });
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });
    if (!profile_to_update) {
      return res.status(404).json({ message: "Profile not found" });
    }

    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();
    console.log(newProfileData);
    return res.json({ message: "Profile data updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name email username profilePicture"
    );

    return res.json({ profiles });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const downloadProfile = async (req, res) => {
  const user_id = req.query.id;

  const userProfile = await Profile.findOne({ userId: user_id }).populate(
    "userId",
    "name email username profilePicture"
  );

  let outputPath = await convertUserDataTOPDF(userProfile);

  return res.json({ message: outputPath });
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection User not found" });
    }

    // Logic to send connection request goes here
    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    await request.save();
    return res.json({ message: "Connection request sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getMyConnectionRequests = async (req, res) => {
  // token sent as query param by frontend (GET request)
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name email username profilePicture");

    return res.json({ connections });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const whatAreMyConnections = async (req, res) => {
  // token sent as query param by frontend (GET request)
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name email username profilePicture");

    return res.json(connections);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connection = await ConnectionRequest.findOne({ _id: requestId });

    if (!connection) {
      return res.status(404).json({ message: "Connection Request not found" });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();
    return res.json({ message: "Connection request updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};




export const getUserProfieAndUserBasedOnUsername = async(req,res) => {
  const {username} = req.query;

  try {
    const user = await User.findOne({username:username});
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const userProfile = await Profile.findOne({userId:user._id}).populate(
      "userId",
      "name email username profilePicture"
    );
    return res.json({"profile":userProfile});
  } catch (error) {
    return res.status(500).json({message:"Server Error", error:error.message});
  }
}