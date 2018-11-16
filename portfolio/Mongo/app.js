const express = require('express') //разработка сервера на "экспресс". ложим содержимое пакета экспресс из папки node_modules
const mongoose = require('mongoose') //подключаем базу мангус
//сделать папку клиент публичной.через  модуль пат
const bodyParser = require('body-parser')
const path = require('path')

const postRouter = require('./routes/post') //путь к роутеру
const authorRouter = require('./routes/author') //путь к роутеру

const keys = require('./keys') //мжно не пистаь тип так как знает что жс. вторым по приоритет жсон
const port = process.env.PORT || 5000 //указываем какой-нибудь порт (локальны хост). если существует системная переменная в которо есть номер порта то используем ее. иначе - используем порт по умолчанию (5000)
const clientPath = path.join(__dirname, 'client') //абсолютный модуль до модуля ПАТ. в ноджс есть глобальная переменная для абсолютного пути для папки где мы работаем __dirname . чтобы указать путь до папки клиент надо указать его вторым параметром,там атвоматом выберется индекс.хтмл

//подключение к мангус.
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected.')) //удачное подключене колбэк функция
  .catch(err => console.error(err)) //обрабокта если неудачное

const app = express()//создание сервера. создаем переменную, которая вызывает функцию экспресс. поулчаем ключевой объект для всего нашего сервера
//метод у объекта АПП  для запуска прослушки всего сервера. первый аргумент - порт. второй - передаем колбэк функцию когда сервер заработает
app.use(bodyParser.json())
app.use('/api/post', postRouter)
app.use('/api/author', authorRouter)
app.use(express.static(clientPath)) //делаем папку статичной. 

app.listen(port, () => {
	console.log(`Server has been started port ${port}`)
}) 