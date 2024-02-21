var express = require("express");
var router = express.Router();

const Outfits = require('../models/outfits');


// Pour la page de finalisation de création de la tenue
// POST avec push en DB + ajout au store
router.post("/", (req, res) => {
  const {top1, top2, bottom, shoes, accessory1, accessory2, accessory3, image, event, id, isFavorite, username} = req.body
  
  Outfits.findOne({ id: id })
  .then(data => {
      if (data === null) {
          const newOutfit = new Outfits({
            top1: top1,
            top2: top2,
            bottom: bottom,
            shoes: shoes,
            accessory1: accessory1,
            accessory2: accessory2,
            accessory3: accessory3,
            image: image,
            event: event,
            id: id,
            isFavorite: false,
            username: username
          })
          newOutfit.save().then(data => {
              console.log(data)
              res.json({ result: true, outfit: data })
          })
      }
  })

})

// Pour la mise à jour de l'état favori de la tenue
// PUT avec push en DB + ajout au store
router.put("/", (req, res) => {
  const outfitId = req.body.outfitId

  Outfits.findOne({id: outfitId})
  .then(data => {
    if (data) {
      data.isFavorite = !data.isFavorite
      data.save().then(updatedOutfit => {
        res.json({ result: true, isFavorite: data.isFavorite })
        })
    } else{
      res.json({result: false, error: 'Something went wrong'})
    }
})
});

// Pour la page de suppression du vêtement
// DELETE avec push en DB + suppression dans le store
// + DELETE de toutes les tenues associées avec push en DB + suppression dans le store
router.delete("/", async (req, res) => {
  const idToDelete = req.body.outfitId;
  console.log(idToDelete)
  const deletedDocument = await Outfits.findOneAndDelete({ id: idToDelete })
  if (!deletedDocument)  res.json({ result: false, message: 'Document not found' });

  res.json({ result: true, message: 'Document deleted successfully' });

});

module.exports = router;