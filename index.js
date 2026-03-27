const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat");
const methodOverride= require('method-override');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

let chat1 = new Chat({
  from: "rohit",
  to: "abhi",
  msg: "i love you brother",
  created_at: new Date(),
});

chat1.save();

// index route
app.get("/chats", async (req, res) => {
  let chats = await Chat.find();
  // console.log(chats);
  res.render("index", { chats });
});

app.get("/", (req, res) => {
  res.send("working");
});

// new route
app.get("/chats/new", (req, res) => {
  res.render("new");
});

//create route
app.post("/chats", async (req, res) => {
  let { from, to, msg } = req.body;
  let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at: new Date(),
  });

  console.log(newChat);

  await newChat
    .save()
    .then((res) => {
      console.log("chat is saved");
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/chats");
});

// edit
app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  console.log(chat);
  res.render("edit", { chat });
});

app.put("/chats/:id/update", async (req, res) => {
  let { id } = req.params;
  let { msg } = req.body;
  let updatedChat=await Chat.findByIdAndUpdate(id,{msg},{runValidators:true,new:true});
  console.log(updatedChat);
  res.redirect('/chats');
});

//destroy route
app.delete("/chats/:id", async (req, res) => {
  let { id } = req.params;
   console.log("delee   "+id);
  let chat=await Chat.findByIdAndDelete(id);
  console.log(chat);
  res.redirect('/chats');
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
