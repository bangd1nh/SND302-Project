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
        req.authenticatedUser = authenticatedUser;
        next();
    });
};
