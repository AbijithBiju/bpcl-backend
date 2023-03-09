const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY || "my_password";
const verifyToken = require("../middleware/verifyToken");

const user = {
    userName: "user",
    password: "12345678",
    userId: "user123",
    type: "normal",
};

router.post("/login", (req, res) => {
    console.log(req.body);
    const { userName, password } = req.body;
    if (user.userName === userName && user.password === password) {
        console.log("login success");

        const accessToken = jwt.sign(
            {
                userName: user.userName,
                userType: user.type,
                userId: user.userId,
            },
            SECRET_KEY,
            {
                expiresIn: "3h",
            }
        );

        console.log({ accessToken });

        res.json({
            status: "SUCCESS",
            userId: user.userId,
            userType: user.type,
            token: accessToken,
        });
    } else {
        res.status(403);
        res.json({
            status: "FAILED",
        });
    }
});

router.get("/:userName", verifyToken, (req, res) => {
    if (req.tokenData.userType === "normal") {
        res.json({
            userType: "normal",
            data: [1, 2, 3, 4, 5, 6],
        });
    }
});

module.exports = router;
