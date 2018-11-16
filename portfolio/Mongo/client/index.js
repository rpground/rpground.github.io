const card = post => {
  return `
  <div class="card sticky-action">
    <div class="card-image waves-effect waves-block waves-light">
      <img class="activator" src="${post.imgPreview}">
    </div>

    <div class="card-content">
      <span class="card-title activator grey-text text-darken-4">${post.title}<i class="material-icons right">more_vert</i></span>
      <p>${post.textPreview}</p>
      <p><a href="#!">This is a link</a></p>
      <small>${new Date(post.date).toLocaleDateString()}</small>
    </div>

    <div class="card-action">
      <a class="btn btn-small red remove" data-id="${post._id}">
          <i class="material-icons remove">delete</i>
      </a>
      <a class="btn btn-small green right remove" data-id="${post._id}">
          <i class="material-icons remove">edit</i>
      </a>
    </div>

    <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">${post.title}<i class="material-icons right">close</i></span>
      <div class="card-text" style="white-space: pre-line;">${post.text.slice(0,300)+'...'}</div>
    </div>
  </div>
  `
}


const cardAuthor = author => {
  return `
  <div class="card">
    <div class="card-image waves-effect waves-block waves-light">
    </div>

    <div class="card-content">
      <span class="card-title activator grey-text text-darken-4">${author.name}<i class="material-icons right">more_vert</i></span>
    </div>

    <div class="card-action">
      <a class="btn btn-small red remove" data-id="${author._id}">
          <i class="material-icons remove">delete</i>
      </a>
      <a class="btn btn-small green right remove" data-id="${author._id}">
          <i class="material-icons remove">edit</i>
      </a>
    </div>
  </div>
  `
}

let posts = []
let authors = []
let modalPost
let modalAuthor
const BASE_URL_POST = '/api/post'
const BASE_URL_AUTHOR = '/api/author'

class PostApi {
  static fetch() {
    return fetch(BASE_URL_POST, {method: 'get'}).then(res => res.json())
  }

  static create(post) {
    return fetch(BASE_URL_POST, {
      method: 'post',
      body: JSON.stringify(post),
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    }).then(res => res.json())
  }

  static remove(id) {
    if (!id) console.log(`попробуйте удалить пост через несколько минут`);
    return  fetch(`${BASE_URL_POST}/${id}`,{
      method: 'delete'
    }).then(res => res.json())
  }
}

class AuthorApi {
  static fetch() {
    return fetch(BASE_URL_AUTHOR, {method: 'get'}).then(res => res.json())
  }

  static create(author) {
    return fetch(BASE_URL_AUTHOR, {
      method: 'post',
      body: JSON.stringify(author),
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    }).then(res => res.json())
  }

  static remove(id) {
    if (!id) console.log(`попробуйте удалить пост через несколько минут`);
    return  fetch(`${BASE_URL_AUTHOR}/${id}`,{
      method: 'delete'
    }).then(res => res.json())
  }  
}

document.addEventListener('DOMContentLoaded', () => {

  PostApi.fetch().then(backendPosts => {
    posts = backendPosts.concat()
    setTimeout(() => {
      renderPosts(posts)
    }, 20)
  })
  modalPost = M.Modal.init(document.querySelector('.modalPost'));
  document.querySelector('#createPost').addEventListener('click', onCreatePost)
  document.querySelector('#posts').addEventListener('click', onDeletePost)
  document.querySelector('#tags').addEventListener('click', addTag)


  AuthorApi.fetch().then(backendAuthors => {
    authors = backendAuthors.concat()
    setTimeout(() => {
      renderAuthors(authors)
    }, 20)
  })
  modalAuthor = M.Modal.init(document.querySelector('.modalAuthor'));
  document.querySelector('#createAuthor').addEventListener('click', onCreateAuthor)
  document.querySelector('#authors').addEventListener('click', onDeleteAuthor)


  let fixedBtn = M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {direction: 'left'});
  let sidenav = M.Sidenav.init(document.querySelectorAll('.sidenav'));
  let sidenav2 = M.Sidenav.init(document.querySelectorAll('.sidenav2'),{edge: 'right',draggable: 'Boolean'});
  let parallax = M.Parallax.init(document.querySelectorAll('.parallax'));
  let materialboxed = M.Materialbox.init(document.querySelectorAll('.materialboxed'));
  let collapsible = M.Collapsible.init(document.querySelectorAll('.collapsible'));
})

function renderPosts(_posts = []) {
  const $posts = document.querySelector('#posts')
  if (_posts.length > 0) {
    $posts.innerHTML = _posts.map(post => card(post)).join(' ')
  } else {
    $posts.innerHTML = `<div class="center">Постов пока нет</div>`
  }
  let materialboxed = M.Materialbox.init(document.querySelectorAll('.materialboxed'));
  let collapsible = M.Collapsible.init(document.querySelectorAll('.collapsible'));
}

function onCreatePost() {
  const $title = document.querySelector('#title')
  const $text = document.querySelector('#text')
  const $textPreview = document.querySelector('#textPreview')
  const $imgPreview = document.querySelector('#imgPreview')

  if ($title.value && $text.value && $textPreview.value && $imgPreview.value){
    const newPost = {
      title: $title.value,
      text: $text.value,
      textPreview: $textPreview.value,
      imgPreview: $imgPreview.value
    }
    PostApi.create(newPost).then(post => {
      posts.push(post)
      renderPosts(posts)
    })
    modalPost.close()
    $title.value = ''
    $text.value = ''
    $textPreview.value = ''
    $imgPreview.value = ''
    M.updateTextFields()
  }
}

function onDeletePost(event) {
  if (event.target.classList.contains('remove')){
    const decision = confirm('Удалить пост?')
    if (decision){
      const id = event.target.getAttribute('data-id')
      PostApi.remove(id).then(() => {
        const postIndex = posts.findIndex(post => post._id === id)
        posts.splice(postIndex, 1)
        renderPosts(posts)
      })
    }
  }
}


function renderAuthors(_authors = []) {
  const $authors = document.querySelector('#authors')
  if (_authors.length > 0) {
    $authors.innerHTML = _authors.map(author => cardAuthor(author)).join(' ')
  } else {
    $authors.innerHTML = `<div class="center">авторов пока нет</div>`
  }
  let materialboxed = M.Materialbox.init(document.querySelectorAll('.materialboxed'));
  let collapsible = M.Collapsible.init(document.querySelectorAll('.collapsible'));
}

function onCreateAuthor() {
  const $name = document.querySelector('#name')
  if ($name.value){
    const newAuthor = {
      name: $name.value
    }
    AuthorApi.create(newAuthor).then(author => {
      authors.push(author)
      renderAuthors(authors)
    })
    modalAuthor.close()
    $name.value = ''
    M.updateTextFields()
  }
}

function onDeleteAuthor(event) {
  if (event.target.classList.contains('remove')){
    const decision = confirm('Удалить автора?')
    if (decision){
      const id = event.target.getAttribute('data-id')

      AuthorApi.remove(id).then(() => {
        const authorIndex = authors.findIndex(author => author._id === id)
        authors.splice(authorIndex, 1)
        renderAuthors(authors)
      })
    }
  }
}


function addTag(event) {
  if (event.target.classList.contains('tag')){
    let txt = document.querySelector('#text'),
    tag1 = event.target.getAttribute('tag1'),
    tag2 = event.target.getAttribute('tag2');
    if (typeof txt.selectionStart === 'number') {
      let b = '<' + tag1 + '></' + tag2 + '>'.length,
          value = txt.value,
          start = txt.selectionStart,
          end = txt.selectionEnd,
          len = end - start;
      txt.value = value.substring(0, start) + tag1 + value.substring(start, end) + tag2 + value.substring(end);
      txt.setSelectionRange(start + len + b, start + len + b);
    }    
  } 
}
