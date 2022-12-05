const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const favicon = require("serve-favicon");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(favicon(__dirname + "/public/favicon.ico"));

const Document = require("./models/Document");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/shareKit", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  const code = `Welcome to shareKit!

Use commands in the top right corner
to create a new file to share with others.`;

  res.render("code-display", {
    code,
    language: "plaintext",
    lineNumbers: code.split("\n").length,
  });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/save", async (req, res) => {
  const value = req.body.value;
  try {
    const document = await Document.create({
      value,
    });

    res.redirect(`/${document.id}`);
  } catch (err) {
    res.render("new", { value });
  }
});

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    res.render("new", { value: document.value });
  } catch (error) {
    res.redirect(`/${id}`);
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    res.render("code-display", { code: document.value, id });
  } catch (err) {
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
