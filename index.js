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

function userExists(username) {
    return userList.some((user) => user.username === username);
}

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    if (!username || !avatar) {
        // checa se todos os campos estão preenchidos
        return res.status(400).send("Preencha todos os campos");
    }

    if (userExists(username)) {
        // checa se o nome de usuario ja está em uso
        return res.status(400).send("Usuario ja existe");
    }

    const newUser = { username, avatar };
    userList.push(newUser);
    return res.status(200).send("OK");
});

app.post("/tweets", (req, res) => {
    const { username, tweet } = req.body;

    if (!userExists(username)) {
        return res.status(401).send("UNAUTHORIZED");
    }
    const newTweet = { username, tweet };
    tweetList.push(newTweet);
    return res.status(200).send("OK");
});
