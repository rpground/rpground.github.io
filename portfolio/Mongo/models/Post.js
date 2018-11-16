//создание модели
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
	title: {
		type: String,
		require: true
	},
	text: {
		type: String,
		require: true
	},
	textPreview: {
		type: String,
		require: true
	},
	imgPreview: {
		type: String,
		require: true
	},					
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('post', postSchema) //экспорт наружу данной модели. хотим зарегистрировать новую коллекцию пот и модель