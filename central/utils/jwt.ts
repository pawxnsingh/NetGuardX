// here i'll have the signin and verify logic of jwt
import jwt, { Secret } from "jsonwebtoken";

const signToken = (user: any): string => {
    const key: Secret | undefined = process.env.SECRET_KEY;
    if (!key) {
        throw new Error("SECRET_KEY is not defined in env variable");
    }
    return jwt.sign(user, key);
};

const verifyToken = (jwtToken: string) => {
    const key: Secret | undefined = process.env.SECRET_KEY;
    if (!key) {
        throw new Error("SECRET_KEY is not defined in env variable");
    }
    return jwt.verify(jwtToken, key);
};

export { signToken, verifyToken };
