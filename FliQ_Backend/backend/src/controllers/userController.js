const userService = require('../services/userService')
const mongoose = require('mongoose')
const UserModel = require('../models/userModel')
const Token = require('../models/tokenModel'); 
const jwt = require('jsonwebtoken')   
const bcrypt = require('bcrypt');

exports.validateLoginType = async (req, res) => {
  try {
    const result = await userService.validateLoginType(req.body);
    res.status(result.status).json({ loginType: result.loginType, message: result.message });
  } catch (err) {
    res.status(err.status || 500).json({ loginType: err.loginType || null, message: err.message });
  }
};

exports.socialRegister = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.registerUser({ email, password });
        res.json({ message: 'User registered successfully for social login', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.register = async (req, res) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json({ message: 'Registered successfully', user: result });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({ message: 'Login successful', token: result.token, user: result.user });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
  }
};


// exports.register = async (req, res) => {
//     try {
//         const { email, password, username } = req.body;

//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) return res.status(400).json({ error: 'User already exists' });

//         // Determine login type based on whether password is provided
//         let loginType = password ? 'normal' : 'social';

//         if (loginType === 'normal' && !password) {
//             return res.status(400).json({ error: 'Password is required for normal registration' });
//         }

//         const user = new UserModel({
//             email,
//             password,
//             username,
//             loginType,
//         });

//         await user.save();

//         res.json({ message: 'User registered successfully', user });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await UserModel.findOne({ email }).select('+password');
//         if (!user) return res.status(404).json({ error: 'User not found' });

//         // Determine loginType
//         const loginType = password ? 'normal' : 'social';

//         if (user.loginType !== loginType) {
//             return res.status(400).json({ error: `Please login using ${user.loginType} method` });
//         }

//         if (loginType === 'normal') {
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });
//         }

//         // Generate JWT
//         const token = jwt.sign(
//             { userId: user._id, email: user.email },
//             process.env.JWT_SECRET,
//             { expiresIn: '1d' }
//         );

//         // Save token in DB
//         await Token.create({ userId: user._id, token });

//         res.json({ message: `${loginType} login successful`, user, token });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // REGISTER (Social + Normal)
// exports.register = async (req, res) => {
//     try {
//         const { email, password, loginType = 'normal', username } = req.body;

//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) return res.status(400).json({ error: 'User already exists' });

//         if (loginType === 'normal' && !password) {
//             return res.status(400).json({ error: 'Password is required for normal registration' });
//         }

//         const user = new UserModel({
//             email,
//             password,
//             username,
//             loginType,
//         });

//         await user.save();

//         res.json({ message: 'User registered successfully', user });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // LOGIN (Social + Normal)
// exports.login = async (req, res) => {
//     try {
//         const { email, password, loginType = 'normal' } = req.body;

//         const user = await UserModel.findOne({ email }).select('+password');
//         if (!user) return res.status(404).json({ error: 'User not found' });

//         if (user.loginType !== loginType) {
//             return res.status(400).json({ error: `Please login using ${user.loginType} method` });
//         }

//         if (loginType === 'normal') {
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });
//         }

//         const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
//             expiresIn: '1d'
//         });

//         res.json({ message: `${loginType} login successful`, user, token });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

exports.socialLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.socialLogin({ email, password });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const userIdFromToken = req.user.userId; 
        
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

 
        if (userId !== userIdFromToken) {
            return res.status(403).json({ error: "Unauthorized: Cannot access another user's profile" });
        }

        const user = await userService.getUserById(userId);
        if(!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        if(!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found' })
        }
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        // const userIdFromToken = req.user._id; 
        const userIdFromToken = req.user.userId; 
        const { userId, username,profileImage,gender,fan } = req.body;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Ensure user can only update their own profile
        if (userId && userId !== userIdFromToken) {
            return res.status(403).json({ error: "Unauthorized: Cannot update another user's profile" });
        }

        const updateData = {};        
        if (username) updateData.username = username;

        //this line without /

        //if (req.file?.path) updateData.profileImage = req.file.path; 


        //this line with / ....
        // if (req.file) {
        //     updateData.profileImage = req.file.location; // AWS S3 URL
        //   }

        // if (req.file) {
        //     updateData.profileImage = req.file.location; // AWS S3 URL  
        //   }
// if(req.file?.filename){
//     updateData.profileImage = `/upload/${req.file.filename}`
// }
        if(profileImage) updateData.profileImage = profileImage; // AWS S3 URL
        if(gender) updateData.gender = gender;
        if(fan) updateData.fan = fan

        const updatedUser = await userService.updateUserProfile(userIdFromToken, updateData);
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await userService.forgetPassword(email);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.validateOtp = async (req, res) => {
   try {
    const { email, otp } = req.body;
    await userService.validateOtp(email, otp);
    res.status(200).json({ message: 'OTP validated successfully' }); 
   } catch (error) {
    res.status(500).json({ error: error.message });
   }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        await userService.resetPassword(email, otp, newPassword);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



exports.saveFcmToken = async (req, res) => {
  const { userId, fcmToken } = req.body;
  try {
    await UserModel.findByIdAndUpdate(userId, { fcmToken });
    res.status(200).json({ message: 'FCM token saved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save token' });
  }
};
