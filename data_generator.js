// DataGenerator - A generator for fake data
//
// This module uses a random timeout to delay the resolution of any promise.
// When you create a DataObject it will store the created_on and wait till
// start() is called. Once that happens it will kick off the timeout and return
// a promise who's value with be the DataObject instance.
//
Q = require("q");

function DataObject(options) { /*jshint eqnull:true */
  if (options == null) {
    options = {};
  }
  this.id         = options.id;
  this.title      = options.title;
  this.timeout    = options.timeout || 10;
  this.created_on = new Date().getTime();
}

DataObject.prototype.getRunningTime = function() {
  if (!this.completed_on) { return -1; }
  return (this.completed_on - this.created_on);
};

DataObject.prototype.start = function() {
  var _this = this;
  return Q.delay(this.timeout).then(function() {
    _this.completed_on = new Date().getTime();
    return _this;
  });
};

DataObject.prototype.toString = function()  {
  var time = this.getRunningTime();
  time = time === -1 ? "" : ("" + time + " ms - ");
  return ("" + this.id + ": " + time + this.title);
};

exports.buildData = function (size) {
  var i, dataObject, storage = [];
  for (i = 0; i < size; i++) {
    dataObject = new DataObject({
      id:      i,
      timeout: randomTimeout(),
      title:   randomTitle()
    });
    storage.push(dataObject);
    console.log("Created " + dataObject.toString());
  }
  return storage;
};

function randomTitle() {
  var renderer = {
    noun: function() {
      return nouns[Math.floor(Math.random() * nouns.length)];
    },
    adjective: function() {
      return adjectives[Math.floor(Math.random() * adjectives.length)];
    }
  };

  var phrase = phrases[Math.floor(Math.random() * phrases.length)];
  return phrase.replace(/{(\w+)}/g, function(match, p1) {
    return renderer[p1]();
  });
}

function randomTimeout() {
  return randomTimeoutBetween(100, 5000);
}

function randomTimeoutBetween(min, max) {
  return (Math.floor((Math.random() * (max - min) + min) / 10) * 10);
}

var phrases = [
  "{adjective} {noun}",
  "The {adjective} {noun}",
  "{noun} of {noun}",
  "The {noun}'s {noun}",
  "The {noun} of the {noun}",
  "{noun} in the {noun}"
];

var nouns = [
  "Dream","Dreamer","Dreams","Waves",
  "Sword","Kiss","Sex","Lover",
  "Slave","Slaves","Pleasure","Servant",
  "Servants","Snake","Soul","Touch",
  "Men","Women","Gift","Scent",
  "Ice","Snow","Night","Silk","Secret","Secrets",
  "Game","Fire","Flame","Flames",
  "Husband","Wife","Man","Woman","Boy","Girl",
  "Truth","Edge","Boyfriend","Girlfriend",
  "Body","Captive","Male","Wave","Predator",
  "Female","Healer","Trainer","Teacher",
  "Hunter","Obsession","Hustler","Consort",
  "Dream", "Dreamer", "Dreams","Rainbow",
  "Dreaming","Flight","Flying","Soaring",
  "Wings","Mist","Sky","Wind",
  "Winter","Misty","River","Door",
  "Gate","Cloud","Fairy","Dragon",
  "End","Blade","Beginning","Tale",
  "Tales","Emperor","Prince","Princess",
  "Willow","Birch","Petals","Destiny",
  "Theft","Thief","Legend","Prophecy",
  "Spark","Sparks","Stream","Streams","Waves",
  "Sword","Darkness","Swords","Silence","Kiss",
  "Butterfly","Shadow","Ring","Rings","Emerald",
  "Storm","Storms","Mists","World","Worlds",
  "Alien","Lord","Lords","Ship","Ships","Star",
  "Stars","Force","Visions","Vision","Magic",
  "Wizards","Wizard","Heart","Heat","Twins",
  "Twilight","Moon","Moons","Planet","Shores",
  "Pirates","Courage","Time","Academy",
  "School","Rose","Roses","Stone","Stones",
  "Sorcerer","Shard","Shards","Slave","Slaves",
  "Servant","Servants","Serpent","Serpents",
  "Snake","Soul","Souls","Savior","Spirit",
  "Spirits","Voyage","Voyages","Voyager","Voyagers",
  "Return","Legacy","Birth","Healer","Healing",
  "Year","Years","Death","Dying","Luck","Elves",
  "Tears","Touch","Son","Sons","Child","Children",
  "Illusion","Sliver","Destruction","Crying","Weeping",
  "Gift","Word","Words","Thought","Thoughts","Scent",
  "Ice","Snow","Night","Silk","Guardian","Angel",
  "Angels","Secret","Secrets","Search","Eye","Eyes",
  "Danger","Game","Fire","Flame","Flames","Bride",
  "Husband","Wife","Time","Flower","Flowers",
  "Light","Lights","Door","Doors","Window","Windows",
  "Bridge","Bridges","Ashes","Memory","Thorn",
  "Thorns","Name","Names","Future","Past",
  "History","Something","Nothing","Someone",
  "Nobody","Person","Man","Woman","Boy","Girl",
  "Way","Mage","Witch","Witches","Lover",
  "Tower","Valley","Abyss","Hunter",
  "Truth","Edge"
];

var adjectives = [
  "Lost","Only","Last","First",
  "Third","Sacred","Bold","Lovely",
  "Final","Missing","Shadowy","Seventh",
  "Dwindling","Missing","Absent",
  "Vacant","Cold","Hot","Burning","Forgotten",
  "Weeping","Dying","Lonely","Silent",
  "Laughing","Whispering","Forgotten","Smooth",
  "Silken","Rough","Frozen","Wild",
  "Trembling","Fallen","Ragged","Broken",
  "Cracked","Splintered","Slithering","Silky",
  "Wet","Magnificent","Luscious","Swollen",
  "Erect","Bare","Naked","Stripped",
  "Captured","Stolen","Sucking","Licking",
  "Growing","Kissing","Green","Red","Blue",
  "Azure","Rising","Falling","Elemental",
  "Bound","Prized","Obsessed","Unwilling",
  "Hard","Eager","Ravaged","Sleeping",
  "Wanton","Professional","Willing","Devoted",
  "Misty","Lost","Only","Last","First",
  "Final","Missing","Shadowy","Seventh",
  "Dark","Darkest","Silver","Silvery","Living",
  "Black","White","Hidden","Entwined","Invisible",
  "Next","Seventh","Red","Green","Blue",
  "Purple","Grey","Bloody","Emerald","Diamond",
  "Frozen","Sharp","Delicious","Dangerous",
  "Deep","Twinkling","Dwindling","Missing","Absent",
  "Vacant","Cold","Hot","Burning","Forgotten",
  "Some","No","All","Every","Each","Which","What",
  "Playful","Silent","Weeping","Dying","Lonely","Silent",
  "Laughing","Whispering","Forgotten","Smooth","Silken",
  "Rough","Frozen","Wild","Trembling","Fallen",
  "Ragged","Broken","Cracked","Splintered"
];
