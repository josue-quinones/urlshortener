require('dotenv').config();
const mongoose = require('mongoose');

console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name:{type:String,required:true},
  age:Number,
  favoriteFoods:[String]
});

const Person = mongoose.model('Person',personSchema);

const createAndSavePerson = (done) => {
  const person = new Person({
    name: "Michael", age: 18, favoriteFoods:["burgers","pizza"]
  });
  person.save((err,data) => done(null,data));
};

const createManyPeople = (arrayOfPeople, done) => {
  const person = Person.create(arrayOfPeople, (err,data) => done(null,data));
};

const findPeopleByName = (personName, done) => {
  Person.find({"name":personName}, (err,data) => done(null,data));
};

const findOneByFood = (food, done) => {
  Person.findOne({"favoriteFoods":[food]}, function(err, data) {
    return done(null,data)
  });
};

const findPersonById = (personId, done) => {
  Person.findById({"_id":personId}, function(err,data) {
    return done(null,data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  const person = Person.findById({"_id":personId}, function(err, data) {
    data.favoriteFoods.push(foodToAdd);
    data.save(function(err,data) {
      return done(null, data);
    })
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  const person = Person.findOneAndUpdate({"name":personName}, {"age":ageToSet},{new:true},function(err,data) {
    return done(null,data);
  });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove({"_id":personId},function(err,data){return done(null,data)});
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({"name":nameToRemove},done(null,data));
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({"favoriteFoods":foodToSearch})
    .sort({'name':1})
    .limit(2)
    .select({'age':false}).exec((err,data) => done(null,data));
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;

// URL DB
/*

// start Mongo Db
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  address:String,
  original_url:String,
  short_url:{type:Number,require:true,unique:true},
  createdAt:{type:Date,expires:3600,default:Date.now}
});

const UrlModel = new mongoose.model("UrlModel",urlSchema);

const createAndSaveNewURL = (address,original,short,date) => {
  let u = new UrlModel({
    address:address,
    original_url:original,
    short_url:short,
    createdAt:date
  });
  const d = u.save()
    .then((d) => {d;})
    .catch((err) => {return console.log(err)});
  return d;
}

const getNextAvailableURL = () => {
  let next_short = 1;
  UrlModel.find()
    .sort('-short_url')
    .limit(1)
    .select('short_url').exec()
    .then((value) => {next_short = value["short_url"]; console.log(next_short,value)})
    .catch((err) => {console.log(err);});
  return next_short + 1;
}

function findURLById (urlId)  {
  return UrlModel.findById({"_id":urlId});
}

function findURLByShort (short) {
  return UrlModel.findOne({"short_url":short});
}

// end Mongo Db
*/