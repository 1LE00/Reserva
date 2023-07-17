const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  tableNumber:{
    type: Number
  },
  seatingCapacity:{
    type: Number
  }
});


const Table = mongoose.model("Table", tableSchema);

module.exports = {Table, tableSchema};
