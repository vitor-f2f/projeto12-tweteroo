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

    if (typeof username !== "string" || typeof avatar !== "string") {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    const newUser = { username, avatar };
    userList.push(newUser);
    return res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
    const { username, tweet } = req.body;

    if (!userExists(username)) {
        return res.status(401).send("UNAUTHORIZED");
    }
    if (!tweet || typeof tweet !== "string" || tweet == "") {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }
    const newTweet = { username, tweet };
    tweetList.push(newTweet);
    return res.status(201).send("OK");
});

function mapTweets(tweets) {
    return tweets.map((tweet) => {
        const user = userList.find((user) => user.username === tweet.username);
        const avatar = user ? user.avatar : "";

        return {
            username: tweet.username,
            avatar,
            tweet: tweet.tweet,
        };
    });
}

app.get("/tweets", (req, res) => {
    if (tweetList.length == 0) {
        return res.status(200).send([]);
    }
    const lastTen = tweetList.slice(-10).reverse();
    const lastTenAvatar = mapTweets(lastTen);
    return res.status(200).send(lastTenAvatar);
});

app.get("/tweets/:username", (req, res) => {
    const { username } = req.params;
    const userTweets = tweetList
        .filter((tweet) => tweet.username === username)
        .reverse();

    if (userTweets.length === 0) {
        return res.status(200).send([]);
    }

    const userTweetsAvatar = mapTweets(userTweets);
    return res.status(200).send(userTweetsAvatar);
});
