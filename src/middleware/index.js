import jwt from "jsonwebtoken";
export const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
};

export const authenticateTokenForUser = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).send("Unauthorize");
    jwt.verify(token, process.env.SECRET_KEY, (err, authenticatedUser) => {
        if (err) return res.status(403).send("forbiden");
        if (authenticatedUser.role === "user") {
            if (authenticatedUser.verify === true)
                req.authenticatedUser = authenticatedUser;
            else res.status(401).send("unverified user");
            next();
        } else {
            res.status(401).send({
                message: "this user can not access because this role user",
            });
        }
    });
};

export const authenticateForAdminUser = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).send("Unauthorize");
    jwt.verify(token, process.env.SECRET_KEY, (err, authenticatedUser) => {
        if (err) return res.status(403).send("forbiden");
        if (authenticatedUser.role === "admin") {
            req.authenticatedUser = authenticatedUser;
            next();
        } else {
            res.status(401).send("not valid token");
        }
    });
};

export const matchUserId = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).send("Unauthorize");
    jwt.verify(token, process.env.SECRET_KEY, (err, authenticatedUser) => {
        if (err) return res.status(403).send("forbiden");
        if (
            authenticatedUser.role === "admin" ||
            authenticatedUser.userId === req.body.userId
        ) {
            next();
        } else {
            res.status(401).send("userId not matches");
        }
    });
};
