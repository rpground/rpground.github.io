const mongoose = require('mongoose')
const Schema = mongoose.Schema

const authorSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	post: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	game: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	code: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},					
	graphic: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	music: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	}
})

module.exports = mongoose.model('author', authorSchema) 