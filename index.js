import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log(`Usando porta 5000`);
});

const userList = [];
const tweetList = [];

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    if (!username || !avatar) {
        return res.status(400).send("Preencha todos os campos");
    }
    const newUser = { username, avatar };
    userList.push(newUser);
    res.status(200).send("OK");
});
