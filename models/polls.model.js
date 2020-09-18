const { Schema, model } = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");


const PollSchema = Schema({
  question: {
    type: String,
    required: true,
    unique: true,
  },
  answers: { type: Array, required: true },
  closed: {
    type: Boolean,
    default: false,
  },
});

PollSchema.plugin(uniqueValidator, {
  message: "This {PATH} is already registered in the Database",
});

PollSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Poll", PollSchema);
