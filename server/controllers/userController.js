const User = require("../model/userModel");

const bcrypt = require("bcrypt");

//Register
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res
      .status(201)
      .json({ msg: "User registered successfully!", status: true, user });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
};

//Login

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: "Username and Password are required", status: false });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: "Invalid Username or Password", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Invalid Username or Password", status: false });
    }
    const userObject = user.toObject();
    delete userObject.password;
    return res
      .status(200)
      .json({ msg: "Login Successfully!!", status: true, user: userObject });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
};

//setAvatar
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { avatarImage } = req.body;

    if (!avatarImage) {
      return res.status(400).json({ msg: "Avatar image is required" });
    }

    const userAvatar = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true } // Ensures the updated document is returned
    );

    if (!userAvatar) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({
      isSet: userAvatar.isAvatarImageSet,
      image: userAvatar.avatarImage,
    });
  } catch (error) {
    console.error("Error in setAvatar:", error);
    return res.status(500).json({ msg: "Internal server error", error });
  }
};

//Contacts
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (error) {
    next(error);
  }
};
