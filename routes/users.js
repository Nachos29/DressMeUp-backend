var express = require('express');
var router = express.Router();

const { checkBody } = require("../modules/checkBody");
const User = require("../models/users");
const Clothe = require("../models/clothes");
const Outfit = require("../models/outfits");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const uniqid = require("uniqid");
const fs = require("fs");

// Pour la page login / signup, création du compte
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["username", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username }).then((usernameFound) => {
    if (usernameFound) {
      res.json({ result: false, error: "Username already exists" });
    } else {
      User.findOne({ email: req.body.email }).then((emailFound) => {
        if (emailFound) {
          res.json({ result: false, error: "Email already exists" });
        } else {
          const hash = bcrypt.hashSync(req.body.password, 10);
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            token: uid2(32),
          });
  
          newUser.save().then((newDoc) => {
            res.json({ result: true, token: newDoc.token });
          });
        }
      });
    }
  }); 
});

// Pour la page login / signin, connexion au compte
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, username: data.username, email: data.email });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

// Pour la page Home / récupération de l'ensemble des vêtements et tenues pour push en store
router.get("/home", (req, res) => {
  const username = req.query.username;
  User.findOne({ username })
    .populate("clothes outfits")
    .then(() => {
      res.json({ clothes: clothesData, outfits: outfitsData });
    });
});

// Pour la page UserProfile / modification du compte
router.put("/", (req, res) => {
  const replacementUsername = req.body.replacementUsername;
  const replacementEmail = req.body.replacementEmail;

  // Utilisez le modèle User pour rechercher l'utilisateur à modifier par son username
  User.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      // L'utilisateur n'a pas été trouvé, renvoyer une erreur
      res.json({ result: false, error: "User not found" });
    } else {
      // Mettre à jour les champs username et email avec les nouvelles valeurs
      user.username = replacementUsername;
      user.email = replacementEmail;

      // Sauvegarder les modifications dans la base de données
      user.save().then((updatedUser) => {
        res.json({ result: true, userData: updatedUser });
      });
    }
  });
});

// Pour la page UserProfile / suppression du compte
router.delete("/", (req, res) => {
  User.deleteOne({ username: req.params.username }).then(() => {
    res.json({ message: "User deleted successfully" });
  });
});

//Récupération des clothes depuis la DB
router.post("/clothes", (req, res) => {
  const username = req.body.username
  Clothe.find({username: username}).then((data) => {
    console.log("data côté back", data)
    res.json(data)
  });
});

//Récupération des clothes depuis la DB
router.post("/outfits", (req, res) => {
  const username = req.body.username
  Outfit.find({username: username}).then((data) => {
    console.log("data côté back", data)
    res.json(data)
  });
});

//pour uploader la photo profil
router.post("/upload", async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);
  console.log("photo");
  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }

  fs.unlinkSync(photoPath);
});

module.exports = router;