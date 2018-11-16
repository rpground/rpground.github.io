const express = require('express')
const router = express.Router()
const Author = require('../models/Author')

//получить все посты.request, respons
// http://localhost:5000/api/post (GET)
//{} значит все посты	. вариант с промисами
router.get('/', async (req, res) => { //async префикс для ассинхронности

	const authors = await Author.find({}) //ждем пока чтото придет с бд
	res.status(200).json(authors) //принимаем ответ
})

// http://localhost:5000/api/post (POST)
router.post('/', async (req, res) => {
	const authorData = {
		name: req.body.name,
		post: req.body.post,
		game: req.body.game,
		music: req.body.music,
		graphic: req.body.graphic,
		code: req.body.code
	}
	
	const author = new Author(authorData)
	
	await author.save() //елси делмаем авэйт надо делать ассинхроннсть асинк/ждем пока схранится
	res.status(201).json(author) //статус что мы создали
})

// http://localhost:5000/api/post/23 (DELETE) удаляем с опр.ид
router.delete('/:authorId', async (req, res) => { //параметр :id
	await Author.remove({_id: req.params.authorId})
	res.status(200).json({ 
		message: 'Удалено'
	})
	
})

module.exports = router