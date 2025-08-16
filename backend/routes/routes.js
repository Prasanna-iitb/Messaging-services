const express = require("express");
const { User } = require("../models/user");
const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(400).send({ error: "Error creating account" });
    }
});

router.post("/login", async (req, res) => {
    const { faceFeatures } = req.body;

    try {
        const results = await User.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index", 
                    path: "faceFeatures",
                    queryVector: faceFeatures,
                    numCandidates: 1, 
                    limit: 1 
                }
            }
        ]);

        if (results.length > 0) {
            res.status(200).send(results[0]);
        } else {
            res.status(404).send({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ error: "Failed to search embedding" });
    }
});

module.exports = {
    router,
};
