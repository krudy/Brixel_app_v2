const User = require('../db/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "SUPER_SECRET_KEY";

class UserController {
    async register(req, res) {
        try {
            const { email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                email,
                password: hashedPassword
            });

            await user.save();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('error in register', error);
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

            res.json({
                message: "Login successful",
                token,
                email: user.email
            });
        } catch (error) {
            console.error("error in login", error);
            res.status(500).json({ error: error.message });
        }
    }

    async logout(req, res) {
        // deleting token on a client side
        res.json({ message: "Logout successful" });
    }

    async profile(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) return res.status(401).json({ message: "No token provided" });

            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            const user = await User.findById(decoded.id).select("-password");
            if (!user) return res.status(404).json({ message: "User not found" });

            res.json(user);
        } catch (error) {
            res.status(401).json({ message: "Unauthorized" });
        }
    }
}

module.exports = new UserController();
