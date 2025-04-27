// middleware/isAdmin.js
const { User } = require('../models/user.model');

const isAdmin = async (req, res, next) => {
    try {
        // Assume userId is being passed in the body (can be params or query as needed)
        const userId = req.body.userId || req.params.userId || req.query.userId; // Adjust based on your API

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Search for the user in the database
        const user = await User.findById(userId);

        // If user not found, return error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is an admin
        if (user.role === 'admin') {
            return next(); // Allow access to the next middleware
        }

        // If the user is not an admin, deny access
        return res.status(403).json({ message: 'Access denied: Admins only' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
};

module.exports = isAdmin;

  