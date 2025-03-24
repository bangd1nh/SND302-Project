import express from "express";
import { countUser } from "../service/user/index.js";
import { countBrrow } from "../service/borrow/index.js";
import { countBook } from "../service/book/index.js";

const stats = express.Router();

stats.get("/", async (req, res) => {
    const user = await countUser();
    const book = await countBook();
    const borrow = await countBrrow();
    const payload = { totalUser: user, totalBook: book, totalBorrow: borrow };
    res.status(200).send(payload);
});

export default stats;
