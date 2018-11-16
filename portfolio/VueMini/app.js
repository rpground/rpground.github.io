const car = (name, year, author, phone, image ) => ({
  name, year, author, phone, image   
})
const log = (text, type, date = new Date()) => ({
  text, type, date  
})
const cars = [
  car('For dead', '2014', 'Yuryol','+7 897 987 67 87', 'images/focus.jpg'),
  car('Essentia', '2017', 'Imaginatium','+7 897 987 67 87', 'images/panamera.jpg'),
  car('Legend od Black', '2018', 'Yuryol','+7 967 087 07 02', 'images/mondeo.jpg')
]

new Vue({
  el: '#app',
  data: {
    cars: cars,
		car: cars[0],
		logs: [],
		selectedCarIndex: 0,
		phoneVisibility: false,
		search: '',
		modalVisibility: false,
		gameName: '',
    gameYear: 2018,
		games: []   
  },
	methods: {
		selectCar: function(index) {
			this.car = cars[index]
			this.selectedCarIndex = index
		},
		newOrder() {
			this.modalVisibility = false
			this.logs.push(
				log(`Succes order: ${this.car.name} - ${this.car.author}`, 'ok')
			)
		},
		cancelOrder() {
			this.modalVisibility = false
			this.logs.push(
				log(`Cancel order: ${this.car.name} - ${this.car.author}`, 'cancel')
			)
		},
		createGame () {
        const game = {
          name: this.gameName,
          year: this.gameYear     
				}

        this.$http.post('http://localhost:3000/games', game)
          .then(response => {
            return response.json()
          })
          .then(newGame => {
            console.log(newGame)
          })
      },
			loadGame () {
        this.$http.get('http://localhost:3000/games')
          .then(response => {
            return response.json()
          })
          .then(games => {
            this.games = games
          })
      }
	},
	computed: {
		phoneBtnText() {
			return this.phoneVisibility ? 'Hide phone' : 'Show Phone'
		},
		filteredCars(){
			var self = this
			const filtered = this.cars.filter(function(car){
				return (car.author.indexOf(self.search) > -1 || car.name.indexOf(self.search) > -1)
			})
			return filtered  	
		}
	},
	filters: {
		date(value){
			return value.toLocaleString()
		}
	}
})

