const User = require('../db/models/user');

class UserController {
    async register(req, res) {
        const user = new User({
            email: req.body.email,
            password: req.body.password
        });

        try {
            await user.save();
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            console.error('error in register', error);
            res.status(400).json({ error: error.message });
        }
    }
}


module.exports = new UserController();