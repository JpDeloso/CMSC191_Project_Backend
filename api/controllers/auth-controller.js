import { UserModel } from "../../models/index.js";
import authErrorCodes from "../../errors/auth-error-codes.js";

const emailExists = async (email) => {
    if (await UserModel.exists({ email })) return true;
    return false;
}

const isUpMail = (email) => {
    if (!email.match(".*up\.edu\.ph$")) return false;
    return true
}

const register = async (req, res) => {
    const { email, password } = req.body;
    const role = "user"; // all users registered through website only have the user role

    // check if UP mail
    if (!isUpMail(email)) return res.status(400).send(authErrorCodes["not-up-mail"]);

    // check if existing
    if (await emailExists(email)) return res.status(400).send(authErrorCodes["email-exists"]);

    // register user
    await UserModel.create({ email, password, role });

    return res.status(200).send({ email });
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    // check credentials
    const user = await UserModel.findOne({ email, password });
    
    if (!user) return res.status(400).send(authErrorCodes["wrong-credentials"]);

    return res.status(200).send({ email });
}

export {
    register,
    signIn
}