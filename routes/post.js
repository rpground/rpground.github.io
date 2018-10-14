const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

//получить все посты.request, respons
// http://localhost:5000/api/post (GET)
//{} значит все посты	. вариант с промисами
router.get('/', async (req, res) => { //async префикс для ассинхронности
//  Post.find({}).then((posts) => {  // 
//		///
//	}) 
	const posts = await Post.find({}) //ждем пока чтото придет с бд
	res.status(200).json(posts) //принимаем ответ
})

// http://localhost:5000/api/post (POST)
router.post('/', async (req, res) => {
	const postData = {
		title: req.body.title,
		text: req.body.text
	}
	
	const post = new Post(postData)
	
	await post.save() //елси делмаем авэйт надо делать ассинхроннсть асинк/ждем пока схранится
	res.status(201).json(post) //статус что мы создали
})

// http://localhost:5000/api/post/23 (DELETE) удаляем с опр.ид
router.delete('/:postId', async (req, res) => { //параметр :id
	await Post.remove({_id: req.params.postId})
	res.status(200).json({ 
		message: 'Удалено'
	})
	
})

module.exports = router