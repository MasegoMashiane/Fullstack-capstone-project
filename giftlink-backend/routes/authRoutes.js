//Step 1 - Task 2: Import necessary packages
const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Import Pino logger


//Step 1 - Task 3: Create a Pino logger instance
const logger = pino();  // Create a Pino logger instance

dotenv.config();

//Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        logger.info('User registered successfully');

        res.json({ authtoken, email: req.body.email });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

//Step 2 - Task 1: Implement /login endpoint
router.post('/login', async (req, res) => {
    try {
        // Step 2 - Task 2: Connect to database
        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Step 2 - Task 3: Check for user credentials
        const theUser = await collection.findOne({ email: req.body.email });

        // Step 2 - Task 7: Send error if user not found
        if (!theUser) {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Step 2 - Task 4: Compare passwords
        const passwordMatch = await bcryptjs.compare(req.body.password, theUser.password);
        if (!passwordMatch) {
            logger.error('Passwords do not match');
            return res.status(404).json({ error: 'Wrong password' });
        }

        // Step 2 - Task 5: Fetch user details
        const userName = theUser.firstName;
        const userEmail = theUser.email;

        // Step 2 - Task 6: Create JWT token
        const payload = {
            user: {
                id: theUser._id.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Send response with token and user details
        res.json({ authtoken, userName, userEmail });

    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

router.put('/update', async (req, res) => {

    // Task 2: Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Task 3: Check email in headers
        const email = req.headers.email;

        if (!email) {
            logger.error('Email not found in the request headers');
            return res.status(400).json({ error: "Email not found in the request headers" });
        }

        // Task 4: Connect to DB
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Task 5: Find user
        const existingUser = await collection.findOne({ email });

        if (!existingUser) {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields (only overwrite if provided)
        existingUser.firstName = req.body.firstName || existingUser.firstName;
        existingUser.lastName = req.body.lastName || existingUser.lastName;
        existingUser.updatedAt = new Date();

        // Task 6: Update user in DB
        const updatedUser = await collection.findOneAndUpdate(
            { email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );

        // Task 7: Create JWT
        const payload = {
            user: {
                id: updatedUser.value._id.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        res.json({ authtoken });

    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;