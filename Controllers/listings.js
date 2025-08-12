const Listing = require("../Model/Listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.map_token;
const geocodingClient = mbxGeocoding({ accessToken:mapToken  });

const index = async (req, res) => {
     
        const allList = await Listing.find({});
        res.render("Listings/index.ejs", { allList });
}
const renderForm = (req, res) => {
         
        res.render("Listings/new.ejs");
}
const showL = async (req, res) => {
     
    
    let { id } = req.params;
    const wantedList = await Listing.findById(id).populate({ path:"reviews",populate:"author"}).populate("owner");
    if (!id||!wantedList) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
        console.log(wantedList);
        res.render("Listings/show.ejs", { wantedList });
}

const postL=async (req, res,next) => {
    let response= await geocodingClient.forwardGeocode({
       query: req.body.listing.location,
        limit: 2
    })
  .send()
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    let url = req.file.path;
    let filename = req.file.filename;
    newlisting.image = { url, filename };
    newlisting.geometry = response.body.features[0].geometry;
    await newlisting.save().then(() => {
        console.log("success");
    });
    console.log(newlisting);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
        
}

const deleteL=async (req, res) => {
    let { id } = req.params; 
    let del = await Listing.findByIdAndDelete(id);
    if (!del) {
           return res.redirect("/listings");
    }
    req.flash("success", "Deleted Successfully");
        res.redirect("/listings");
}

const EditL=async (req, res) => {
    let { id } = req.params;
    let EditList = await Listing.findById(id);
    let OriginalImage = EditList.image.url;
    OriginalImage = OriginalImage.replace("/upload","/upload/w_100,h_100,c_fill");
    console.log(OriginalImage);
     if (!id||!EditList) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("Listings/edit.ejs", { EditList,OriginalImage });
}

const putL = async (req, res) => {
    let response= await geocodingClient.forwardGeocode({
       query: req.body.listing.location,
        limit: 2
    })
  .send()
    let { id } = req.params;
    let uplist = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    uplist.geometry = response.body.features[0].geometry;

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        uplist.image = { url, filename };
        await uplist.save();
    } else {
        await uplist.save();
    }
    console.log(uplist);
    req.flash("success", "Listing Successfully Updated");
    res.redirect(`/listings/${id}`);
}

module.exports={index,renderForm,showL,postL,deleteL,EditL,putL}