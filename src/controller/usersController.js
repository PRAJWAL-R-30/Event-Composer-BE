const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');


const getToken = (user) => {
    return "jwt-token"
}

exports.addUser = async (req, res, next) => {
    try {
        const usersCollection = await db.collection('users');
        const user = await usersCollection.findOne({email: req.body.email});
        if(user) {
            return res.status(409).json({error: "This Email Id is already registered"});
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds, you can adjust as needed
        
        req.body.password = hashedPassword;

        const response = await usersCollection.insertOne(req.body);

        const userDetails = await usersCollection.findOne({_id: response.insertedId}); // Get the added user details from the response
        delete userDetails.password;

        jwt.sign({user: userDetails}, process.env.JWT_SECRET_KEY, (err, token) => {
            console.log(token);
            res.json({
                token
            }).status(200);
        })
    } catch (err) {
        console.log("Error on users Controller: addUser Err = ", err);
        return res.json({ error: err, status: 500 }).status(500);
    } 
};

exports.userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const usersCollection = await db.collection('users');
        const user = await usersCollection.findOne({email});

        if(!user) {
            return res.status(401).json({error: 'You are not registered with Incharge Event Composer'});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(403).json({ error: 'Incorrect Password' });
        }

        delete user.password;

        jwt.sign({user: user}, process.env.JWT_SECRET_KEY, (err, token) => {
            console.log(token);
            res.json({
                token
            }).status(200);
        })

        return res;

    } catch(err) {
        console.log("Error on users Controller: userLogin Err = ", err);
        return res.json({ error: err, status: 500 }).status(500);
    }
};

exports.getUserDetails = async (req, res, next) => {
    try {
        const userId = req.user._id;
        console.log(userId);

        if (!userId) {
            return res.status(401).json({error: 'User Authentication Failed'});
        }

        const usersCollection = await db.collection('users');
        const userDetails = await usersCollection.findOne({_id: new ObjectId(userId)});
        delete userDetails.password;

        res.send(userDetails).status(200);

    } catch(error) {
        console.log(error);
        return res.json({ error: error, status: 500 }).status(500);      
    }
}