$('#app').css("height", window.outerHeight + 'px')
$('#app').css("width", window.outerWidth + 'px')

var boardWidth = 15;
var points = [];
var pieces = {};

function cover(value){
	return value < 10 ? `0${value}` : ''+value
}

for (var i = 0; i < boardWidth; i++) {
	var row = []
	for (var j = 0; j < boardWidth; j++) {
		row.push(-1)
		pieces[cover(i)+cover(j)] = ''
	}
	points.push(row)
}

var gomoku = new Vue({
	el: '#app',
	data: {
		gameOver: false,
		last: '',
		player: 0,
		boardWidth: boardWidth,
		undoLeft: 3,
		pieces: pieces,
		points: points,
		results: { 0: 0, 1: 0},
		imgSrc: { 0: 'img/black.jpg', 1: 'img/white.jpg' }
	},
	methods: {
		tick: function (x, y) {
			if (this.points[x][y] == -1 && !this.gameOver) {
				this.started = true
				this.points[x][y] = this.player
				this.pieces[cover(x)+cover(y)] = this.player ? 'w' : 'b'
				this.last = [x, y]
				if (!this.check(x, y)) {
					this.player = this.player ? 0 : 1	
				}
			}
		},
		undo: function () {
			if (this.last && !this.gameOver) {
				this.points[this.last[0]][this.last[1]] = -1
				this.pieces[this._cover(this.last[0])+this._cover(this.last[1])] = ''
				this.player = this.player ? 0 : 1
				this.last = ''
				this.undoLeft --;
			}
		},
		newGame: function () {
			this.gameOver = false
			this.last = ''
			this.player = 0
			this.undoLeft = 3
			for (var i = 0; i < this.points.length; i++) {
				for (var j = 0; j < this.points.length; j++) {
					this.points[i][j] = -1
				}
			}
			for (var dot in this.pieces) {
				this.pieces[dot] = ''
			}
		},
		check: function (x, y) {
			current = this.points[x][y]
			var hasWinner = false

			// check -----
			if (!hasWinner) {
				var countLeft = 4
				for (var j = y-1; j >= 0; j--) {
					if (this.points[x][j] == current) {
						countLeft --
						if (countLeft <= 0) {
							hasWinner = true
							break
						}
					} else {
						break
					}
				}
				if (!hasWinner) {
					for (var j = y+1; j < this.points.length; j++) {
						if (this.points[x][j] == current) {
							countLeft --
							if (countLeft <= 0) {
								hasWinner = true
								break
							}
						} else {
							break
						}
					}
				}
			}

			// check |
			if (!hasWinner) {
				var countLeft = 4
				for (var i = x-1; i >= 0; i--) {
					if (this.points[i][y] == current) {
						countLeft --
						if (countLeft <= 0) {
							hasWinner = true
							break
						}
					} else {
						break
					}
				}
				if (!hasWinner) {
					for (var i = x+1; i < this.points.length; i++) {
						if (this.points[i][y] == current) {
							countLeft --
							if (countLeft <= 0) {
								hasWinner = true
								break
							}
						} else {
							break
						}
					}
				}
			}

			// check \
			if (!hasWinner) {
				var countLeft = 4
				for (var i = x-1, j = y-1; i >= 0 && j>= 0; i--, j--) {
					if (this.points[i][j] == current) {
						countLeft --
						if (countLeft <= 0) {
							hasWinner = true
							break
						}
					} else {
						break
					}
				}
				if (!hasWinner) {
					for (var i = x+1, j = y+1; i < this.points.length && j < this.points.length; i++, j++) {
						if (this.points[i][j] == current) {
							countLeft --
							if (countLeft <= 0) {
								hasWinner = true
								break
							}
						} else {
							break
						}
					}
				}
			}

			// check /
			if (!hasWinner) {
				var countLeft = 4
				for (var i = x-1, j = y+1; i >= 0 && j < this.points.length; i--, j++) {
					if (this.points[i][j] == current) {
						countLeft --
						if (countLeft <= 0) {
							hasWinner = true
							break
						}
					} else {
						break
					}
				}
				if (!hasWinner) {
					for (var i = x+1, j = y-1; i < this.points.length && j >= 0; i++, j--) {
						if (this.points[i][j] == current) {
							countLeft --
							if (countLeft <= 0) {
								hasWinner = true
								break
							}
						} else {
							break
						}
					}
				}
			}

			// process result
			if (hasWinner) {
				this.gameOver = true
				this.results[current] ++
				var winner = current +1
				this.$alert('Winner: Player '+winner, 'Game Over', {
          		confirmButtonText: 'OK',
          	    callback: action => {}})
			}
			return hasWinner
		},
		_cover: function(value) {
			return value < 10 ? `0${value}` : ''+value
		}
	}
})