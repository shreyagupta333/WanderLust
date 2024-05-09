const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
// const upload = multer({ dest: 'uploads/' });




router
.route("/")  
.get(wrapAsync(listingControllers.index))
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingControllers.createListing));

// Search by location 
router.get("/search",wrapAsync (listingControllers.searchCountry));

//index Route
// router.get("/",wrapAsync(listingControllers.index));

//New Route  
router.get("/new",isLoggedIn,listingControllers.renderNewForm);

router.route("/:id")
  .get(
  wrapAsync(listingControllers.showListing))
  .put(
   isLoggedIn,
   isOwner,
   upload.single('listing[image]'),
   validateListing,
   wrapAsync(listingControllers.updateListing))
   .delete(isLoggedIn,isOwner,
   wrapAsync(listingControllers.destroyListing));


//Show Route
// router.get("/:id", 
//   wrapAsync(listingControllers.showListing));
      


//Create Route 
// router.post("/" , isLoggedIn,validateListing ,
// wrapAsync(listingControllers.createListing));


//Edit Route 
router.get("/:id/edit",
isLoggedIn,isOwner,
wrapAsync(listingControllers.renderEditForm));

//Update Route 
// router.put("/:id",
// isLoggedIn,
// isOwner,
// validateListing,
// wrapAsync(listingControllers.updateListing));
// if(!req.body.listing){
// throw new ExpressError(400,"Send valid data for listing.")
// }




//Delete Route
// router.delete("/:id",isLoggedIn,isOwner,
// wrapAsync(listingControllers.destroyListing));

module.exports = router;