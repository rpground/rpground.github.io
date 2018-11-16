СОЗДАНИЕ ПРИЛОЖЕНИЯ	
  
1) npm init - для того чтоб сгенерировать пекейдж джейсон

2) создаем файл app.js

3)  для установки экспресса пишем 
	npm install express
	
	после этого появляется в пэкейдж ЖСОН строки

	"dependencies": {
	    "express": "^4.16.3"
	  },

4) const express = require('express') 
подключаем сервер "экспресс". если без слешей, то ложим содержимое пакета экспресс из папки node_modules

5) const app = express()
создание сервера. создаем переменную, которая вызывает функцию экспресс. поулчаем ключевой объект для всего нашего сервера

6) const port = process.env.PORT || 5000 
указываем какой-нибудь порт (локальны хост). если существует системная переменная в которо есть номер порта то используем ее. иначе - используем порт по умолчанию (5000)

7) создаеми прослушку всего сервера
метод у объекта АПП  для запуска прослушки всего сервера. первый аргумент - порт. второй - передаем колбэк функцию когда сервер заработает

app.listen(port, () => {
	console.log(`Server has been started port ${port}`)
}) 

8) //пишем скипт для запуска весь наш сервер. обращается к ноджс и запускает файл. запускаем через консоль "npm run start". затем в браузере вводим http://localhost:5000/ и переходим на сервер. там будет ошибка о том что не можем получить корневой роутер (cannot get/) это норма, так как еще нет файла индекс.хтмл

"scripts": {
	"start": "node app.js"
},
	

9) создаем файл индекс.хтмл. Для того чтоб указать экспрессу где искать файл хмл подключаем модуль для работы с путями

const path = require('path')

10) const clientPath = path.join(__dirname, 'client') 
абсолютный модуль до модуля ПАТ. в ноджс есть глобальная переменная для абсолютного пути для папки где мы работаем __dirname . чтобы указать путь до папки клиент надо указать его вторым параметром,там атвоматом выберется индекс.хтмл

11) делаем папку статичной, публичной. 
app.use(express.static(clientPath)) 


12) для того чтобы пересобрать сервер надо сначала его остановить (ктрл+с), потом Y и нажать энтер, потом опять ран старт
	
13) чтобы не пересобирать постоянно устнавливаем в папку "нодеМон"
	npm install nodemon -D 
минус д - это для разработки а не продакшена
	
после этого появляется в пэкейдж ЖСОН строки
"devDependencies": {
    "nodemon": "^1.17.5"
}
	
после этого добавляем в скрипты для перезапуска сервера
	"dev": "nodemon app.js"

ПОДКЛЮЧЕНИЕ МОНГОДБ

1)	заходим на сайт mlab.com, регистрируемся

LePrianik
yuryol@mail.ru
LePrianik
Pkjq15041990

2) создаем базу нажав кнопку
create new

3) выбираем провайдера например майкрософт азур и бесплатный тариф. регион лучше европа

4) называем базу любым именем,нажимаеи континуе

5) поулчаем чек, жмякаем субмит ордер

6) переходим в базу. копируем строку МОГНОДБ УРИ 
mongodb://leprianik:Pkjq15041990@ds016118.mlab.com:16118/fullstack-blog

7) для создания юзера нажимаем кнопку 
адд датабейс юзер

у юзера leprianik
Pkjqvkf,15041990

8) подключаем пакет мангус

npm install mongoose

9) создаем в папке файл keys.js, в котором мы будем хранить константы

10) для экспорта констант пишем константу например mongoURI в объект module.exports 

module.exports = {
	mongoURI: 
}

11) вводим путь из шага 6, в котором указываем пользователя из шага 7

module.exports = {
	mongoURI: 'mongodb://leprianik:Pkjq15041990@ds016118.mlab.com:16118/fullstack-blog'
}

12) подключаем базу мангус в проект

const mongoose = require('mongoose')

13) экспорт файла кейс.жс

const keys = require('./keys') 
мжно не пистаь типа так как знает что жс. вторым по приоритет жсон

 14) подключаем к монго, указав переменную  mongoURI в файле keys

 mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected.')) //удачное подключене колбэк функция
  .catch(err => console.error(err)) //обрабокта если неудачное

СОЗДАНИЕ МОДЕЛИ ДЛЯ ХРАНЕНИЯ СУЩНОСТЕЙ В БД

1) создаем папку для моделей, напрмиер models

2) создаем файл жс для модели "пост". принято называть фацйл моделей с большой буквы
Post.js

3) подключаем в файл мангус
const mongooses = require('mongoose')

4) создаем схему (описание модели)
const Schema = mongoose.Schema

5) создаем эксземпляр класса объхекта схема  Schema

const postSchema = new Schema({})

6) создаем в объекте поста свойства. 
ИД не создаем, так как его выдаст монго

const postSchema = new Schema({
	title: {},
	date: {}
})


7) даем свойства для свойств - тип и "реквайрд" (обязательный ли параметр).
плюс создаем дату поста по умолчанию,которую само приложение дает

const postSchema = new Schema({
	title: {
		type: String,
		require: true
	},
	text: {
		type: String,
		require: true
	},	
	date: {
		type: Date,
		default: Date.now
	}
})

8) module.export = mogoose.model('post', Schema)
экспорт наружу данной модели. хотим зарегистрировать новую коллекцию поcт и модель

СОЗДАНИЕ РОУТОВ

1) создаем папку например routes, внутри него файл post.js

2) подключаем экспресс 
const express = require('express')

3) создаем переменную из библиотеки экспресс
const router = express.Router()

4) подключаем модель

const Post = require('../models/Post')

5) в конце файла доабвляем экспорт
module.exports = router

5) подключаем роут в основной файл app.js

const postRouter = require('./routes/post') //путь к роутеру

6) применяем роут. первый параметр - префикс. второй - сам роутер.
всё что делаем через АПИ лучше делать через префикс апи

app.use('/api/post', postRouter)

7) таким образом у нас получится путь реагирующий на (GET)
http://localhost:5000/api/post 

8) переходим обратно в файл post.js. 
для получения экспрессу надо писать гет
router.get('/', async (rew, res) => {}

для созщдания пост
router.post('/', async (rew, res) => {}

, для удаления delete
router.delete('/', async (rew, res) => {}

9) МЕТОД ГЕТ
для получчения всех постов надо передать пустой объект  без каких любо условий ({})
Post.find({})

10) для обработки ассинхронности добавляем колбэк через промис
.then((posts) => {}


11) лучше делать по-другому,так как нет вложенных функций

router.get('/', async (rew, res) => {
	const posts = await Post.find({}) //ждем пока чтото придет с бд
})

12) принимаем ответ, указав статус (обычно если все хорошо то саттус 200)
res.status(200).json(posts) //принимаем ответ

13) МЕТОД ПОСТ
передаем форму

const postData = {
	title:'',
	text: ''
}

14) тайтл хранится в реквест в объекте бади. 

const postData = {
	title: req.body.title,
	text: req.body.text
}

15) создаем новый пост через модель Post.js

const post = new Post(postData)

16) сохраняем в базе 
await post.save 

17) если используем авэйт то функция должна быть ассинхронной, поэтому
стиавим асинк
router.post('/', async (rew, res) => {}

18) отвечаем клиенту что создался (статус 201) и возвращаем пост
res.status(201).json(post) //статус что мы создали

19) МЕТОД ЕЛЕТЕ
пост у нас будет с ури типа http://localhost:5000/api/post/23 
поэтому надо нам взять динамическую часть,не забывая вставить асинк
router.delete('/:postId', async (rew, res) => {}

20) удаляем  пост с данным айди,переданным в параметре postId
Post.remove({_id: req.params.postId})

21) даем статус
res.status(200).json({ 
	message: 'Удалено'
})


ФРОНТЕНД

1) подключаем материалайз https://materializecss.com
в индекс через сидиэн

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css">

2) добавляем скрипты
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/js/materialize.min.js"></script>

3) подключаем иконки 
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

4) создаем конетйнер,внутри роу. внутри див
через s задаем размер колокни для большого экрана. 
м - для среднего, л - для маленького
оффсет - отступы

<div class="container" style="padding-top: 50px;">
    <div class="row">
        <div class="col s12 m8 offset-m2 l6 offset-l3" id="posts">
		</div>
    </div>
</div>        

5) id="posts"
для вывода всех постов

6) копируем с сайта код карточки
blue-grey darken-1 - бэкграунд
white-text - цвет еткста

div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">Card Title</span>
          <p>I am a very simple card. I am good at containing small bits of information.
          I am convenient because I require little markup to use effectively.</p>
        </div>
        <div class="card-action">
          <a href="#">This is a link</a>
          <a href="#">This is a link</a>
        </div>
      </div>


7)  убиарем ссылки в карт жкшене, доабвляя в него кнопку


 <div class="card-action">
 	<button class="btn btn-small red">
 		<i class="material-icons">delete</i>
 	</button>
 </div>

 8) создаем index.js? 

9) создаем константу для передачи поста
const card = post => { return ``}

10) вырезаем див и вставляем его в файл 
const card = post => {
  return `              
		<div class="card z-depth-4">
		    <div class="card-content">
		      <span class="card-title">Card Title</span>
		      <p>I am a very simple card. I am good at containing small bits of information.
		      I am convenient because I require little markup to use effectively.</p>
		    </div>
		    <div class="card-action">
		        <button class="btn btn-small red">
		            <i class="material-icons">delete</i>
		        </button>                  
		    </div>
		</div> 
	`

11) вставляем переменные

const card = post => {
  return `
  <div class="card z-depth-4">
      <div class="card-content">
          <span class="card-title">${post.title}</span>
          <p>${post.text}</p>
          <small${post.date}</small>
      </div>
      <div class="card-action">
          <button class="btn btn-small red">
              <i class="material-icons">delete</i>
          </button>
      </div>
  </div>
  `
}

12) создаем класса
class PostApi {}

13) добавляем запрос в класса
class PostApi {
  static fetch() {
    return fetch(параметр URL, метод)
  }
}

14) находим  параметр URL (берем из файла app.use('/api/post', postRouter))

const BASE_URL = '/api/post'

15) получается 

class PostApi {
  static fetch() {
    return fetch(BASE_URL, {method: 'get'})
  }
}


16) переводим ответ от сервера в объекта

fetch(татата).then(res => res.json())


17) запрос делаем после нажатия н аобработчик событий после загрузки всей 
страницы DOMContentLoaded

document.addEventListener('DOMContentLoaded', что мы хотим сделать)

18) обращаемся к постАПИ, вызываем метод фетч, который возвращает промис 

PostApi.fetch().then()

19) получаем массив backendPosts, который будем хранить в переменной postSchema

let posts = []

document.addEventListener('DOMContentLoaded', () => {
  PostApi.fetch().then(backendPosts => {posts})
})

20) создаем дубликат массива чтоб избежать мутаций backendPosts.concat()

document.addEventListener('DOMContentLoaded', () => {
  PostApi.fetch().then(backendPosts => {posts = backendPosts.concat()})
})

21) рендерим посты через функцию renderPosts(posts)

document.addEventListener('DOMContentLoaded', () => {
  PostApi.fetch().then(backendPosts => {
    posts = backendPosts.concat()
      renderPosts(posts)
  })
})


22) рендерим посты в функции renderPosts(posts). по умолчанию это пустой массив
внутри присваиваем переменной селектор с айди "пост"" в котором будеут постызнак 
доллар для того чтоб понять что это элемиент

function renderPosts(_posts = []) {
  const $posts = document.querySelector('#posts')
}

23) доабвляем првоерка есть ли посты (длина массива ноль?)


function renderPosts(_posts = []) {
  const $posts = document.querySelector('#posts')

  if (_posts.length > 0) {
    $posts.innerHTML = обработка постов
  } else {
    $posts.innerHTML = `<div class="center">Постов пока нет</div>`
  }
}

24) перебираем посты, переовдим в функцию КАРТ в хтмл, превращаем в строку

 $posts.innerHTML = _posts.map(post => card(post)).join(' ')

 25) получается

 function renderPosts(_posts = []) {
  const $posts = document.querySelector('#posts')

  if (_posts.length > 0) {
    $posts.innerHTML = _posts.map(post => card(post)).join(' ')
  } else {
    $posts.innerHTML = `<div class="center">Постов пока нет</div>`
  }
}

25) добавляем компонент прелоадер. 

<div class="preloader-wrapper small active">
    <div class="spinner-layer spinner-green-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>

  26)  для его првоерки можно обернуть renderPosts(posts) в сеттаймаут  
setTimeout(() => {renderPosts(posts)}, 2000)