import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d" //token will expire in 7 days
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie will expire in 7 days
        httpOnly:true, //prevents client-side JavaScript from accessing the cookie
        sameSite: "strict", //cookie will only be sent in a first-party context
        secure: process.env.NODE_ENV === "development", //cookie will only be sent over HTTPS
    })

    return token;
}