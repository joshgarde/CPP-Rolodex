const mongoose = require('mongoose');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const { Schema } = mongoose;

const ServerSchema = new Schema({
  _id: String,
  name: String,
  description: { type: String, max: 140 },
  defaultChannel: String,
  public: { type: Boolean, default: true }
});

ServerSchema.plugin(mongoose_fuzzy_searching, { fields: ['name', 'description'] })

module.exports = mongoose.model('Server', ServerSchema);
