const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.searchCountry = async(req,res)=>{
  document.getElementById('searchCountry').addEventListener('submit', async function(event) {
    // event.preventDefault();
    // let Country = this.element[0];
    // const allListings = await Listing.find({country:Country.value});
    // console.log("all listings");
    // res.render("Listings/index.ejs",{allListings});
    console.log("clicked");
    
  }
)};

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    console.log("all listings");
    res.render("Listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    console.log(req.user);
    res.render("Listings/new.ejs");
};

module.exports.showListing = async (req,res) =>{
  
  
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate: {
        path: "author",
      }
    }).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
   
    console.log(listing);
    console.log(listing.description);
    console.log(listing.image);
    let response = await geocodingClient
    .forwardGeocode({
    query: listing.location,
    limit: 1,
    })
    .send();
    listing.geometry = response.body.features[0].geometry;
    savedlisting = await listing.save();
    console.log(savedlisting);
  
    res.render("Listings/show.ejs",{listing}); 

}  

module.exports.createListing =async(req,res,next)=>{
  let response = await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
  .send();
  // res.send("done!");
  
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url,"..",filename);

  const newListing = new Listing(req.body.listing);
  // console.log(req.user);
  newListing.owner = req.user._id;
 // console.log(newListing);
  newListing.image = {url,filename};
  newListing.geometry = response.body.features[0].geometry;
  savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success","New Listing Created");
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you want to edit does not exist");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("Listings/edit.ejs",{listing,originalImageUrl});
    
};

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings")
};

