const initdata = require("./data");
const mongoose = require("mongoose");
const Listing = require("../Model/Listing.js");

main().then(() => {
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

initdata.data=initdata.data.map((obj)=>({...obj,owner:'6891318c8a780d4ef2f7ad04'}))

console.log(initdata.data);
Listing.insertMany(initdata.data).then(() => {
    console.log("sucess");
}).catch((err) => {
    console.log(err);
});

