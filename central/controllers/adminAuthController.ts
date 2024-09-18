import { Request, Response } from "express";
import { userModel } from "../models";
import { signToken } from "../utils/jwt";
import zod from "zod";

// this is the the auth controller this gonna hava all the
/**
 * {
 *      name,
 *      username,
 *      email,
 *      password,
 * }
 */

const signupZodSchema = zod.object({
    name: zod.string().max(50),
    username: zod.string().max(15),
    email: zod.string().email(),
    password: zod.string().min(8),
});

export const adminSignupController = async (req: Request, res: Response): Promise<any> => {
    const { success } = signupZodSchema.safeParse(req.body);
    // firstly check the detail sent by user if it is not correct send
    // back the error message
    if (!success) {
        return res.status(411).json({
            message: "Input are not valid/Incorrect Input",
        });
    }
    // if the information is correct then we need to check
    // does this user exist or nor if exist then again return back response
    // if dont proceed for further processing

    const existingUser = await userModel.findOne({
        username: req.body.username,
    });

    if (existingUser) {
        return res.status(411).json({
            message: "User already Exist",
        });
    }

    // if user don't exist
    // then we need to store the user information and return a
    // signed jwt token

    // thing to note here is we have to hash the user password
    // then store it to the database

    // assignment: hashing and encryption difference
    // password hashing - bcrypt

    const userSignup = await userModel.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    // now user has been successfully created and we need to sign the jwt token
    // now spin up the server
    console.log(userSignup);

    const userId = userSignup._id;

    // create a jwt token
    const token = signToken({
        userId: userId,
        email: userSignup.email,
    });

    return res.status(200).json({
        message: "user created successfully",
        token: token,
        name: userSignup.name,
        email: userSignup.email,
        username: userSignup.username,
    });
};

// this is server side validation
const signinZodSchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
});

/**
 * * the req object will have two object
 * {
 *      email,
 *      password
 * }
 *
 * @param req
 * @param res
 */

export const adminLoginController = async (req: Request, res: Response) => {
    const { success } = signinZodSchema.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "User Input Details are not valid",
        });
    }

    // user input are valid we have to check does user exist or not
    const user = await userModel.findOne({
        email: req.body.email,
    });

    if (!user) {
        return res.status(404).json({
            message: "user doesn't exist",
        });
    }

    const isPasswordMatched = user?.password === req?.body?.password;

    if (!isPasswordMatched) {
        return res.status(411).json({
            message: "password is incorrect",
        });
    }

    const userId = user._id;

    // token is successfully generated
    const token = signToken({
        userId: userId,
        email: user.email,
    });

    return res.status(200).json({
        message: "user signedIn successfully",
        token: token,
        name: user.name,
        email: user.email,
        username: user.username,
    });
};


export const logout = (req: Request, res: Response) => {
    return res.status(200).json({
        message: "user signin successfully",
    });
};


