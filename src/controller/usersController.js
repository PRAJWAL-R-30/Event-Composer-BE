const db = require('../config/db.config');
const bcrypt = require('bcrypt');

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

        res.send(userDetails).status(204);
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

        return res.send(user).status(200);

    } catch(err) {
        console.log("Error on users Controller: userLogin Err = ", err);
        return res.json({ error: err, status: 500 }).status(500);
    }
}