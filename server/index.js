require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

const host = process.env.HOST || "http://localhost";
const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  url: String,
  upVotes: { type: Number, default: 0 },
  downVotes: { type: Number, default: 0 },
});
const Url = mongoose.model("Url", urlSchema);

app.get("/", (req, res) => {
  res.send("CROWDSOURCED FIREWALL API");
});

app.post("/add", async (req, res) => {
  console.log(req.body);
  const { url } = req.body;
  console.log("Adding url:", url);
  const newUrl = new Url({ url });
  try {
    await newUrl.save();
    res.send(newUrl);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/downvote", async (req, res) => {
  const { id, url } = req.body;
  console.log(`Downvoting url: ${url} with id: ${id}`);
  try {
    if (id) {
      const foundUrl = await Url.findById(id);
      foundUrl.downVotes += 1;
      await foundUrl.save();
      res.send(foundUrl);
    } else if (url) {
      const foundUrl = await Url.findOne({ url });
      if (foundUrl) {
        foundUrl.downVotes += 1;
        await foundUrl.save();
        res.send(foundUrl);
      } else {
        const newUrl = new Url({ url });
        await newUrl.save();
        res.send(newUrl);
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/upvote", async (req, res) => {
  const { id, url } = req.body;
  console.log(`Upvoting url: ${url} with id: ${id}`);
  try {
    if (id) {
      const foundUrl = await Url.findById(id);
      foundUrl.upVotes += 1;
      await foundUrl.save();
      res.send(foundUrl);
    } else if (url) {
      const foundUrl = await Url.findOne({ url });
      if (foundUrl) {
        foundUrl.upVotes += 1;
        await foundUrl.save();
        res.send(foundUrl);
      } else {
        const newUrl = new Url({ url });
        await newUrl.save();
        res.send(newUrl);
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/all", async (req, res) => {
  console.log("Getting all urls");
  try {
    const urls = await Url.find();
    res.send(urls);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/check", async (req, res) => {
  try {
    const { url } = req.body;
    const match = Url.findOne({ url });
    if (match) {
      if (match.upVotes > match.downVotes) {
        res.send(false);
      } else {
        res.send(true);
      }
    } else {
      res.send(false);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server listening at ${host}:${port}`);
});
