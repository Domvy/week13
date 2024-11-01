const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../schemas/user");

router.post("/signup", async (req, res) => {
    const { nickname, password, confirmPassword } = req.body;

    const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
    if (!nicknameRegex.test(nickname)){
        return res.status(400).json({message: "닉네임은 최소 3자 이상, 알파벳과 숫자로 구성되어야 합니다."})
    }

    if (password.length < 4 || password.includes(nickname)){
        return res.status(400).json({message: "비밀번호는 최소 4자 이상이어야 합니다."})
    }

    if (password !== confirmPassword){
        return res.status(400).json({message: "비밀번호가 일치하지 않습니다."})
    }

    const existingUser = await User.findOne({ nickname });
    if (existingUser){
        return res.status(400).json({message: "중복된 닉네임 입니다."})
    }

    const user = new User({ nickname, password });
    await user.save();

    res.status(201).json({ message: "회원가입이 완료되었습니다." });
});

router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;

    const user = await User.findOne({ nickname, password });
    if (!user) {
        return res.status(400).json({ message: "닉네임 또는 패스워드를 확인해주세요." });
    }

    const token = jwt.sign({ userId: user._id, nickname: user.nickname },
        process.env.JWT_SECRET, { expiresIn: "1h" }
    );

    res.cookie("authToken", token, {
        httpOnly: true,
        secure: true
    });

    res.status(200).json({ message: "로그인에 성공했습니다." });
});

module.exports = router;