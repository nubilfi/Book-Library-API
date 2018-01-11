const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const Schema = mongoose.Schema;
const AuthorSchema = new Schema({
	fullname: { type: String },
	email: { type: String },
	createdAt: { type: Date, default: Date.now() },
	updatedAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Author', AuthorSchema);