var ractive = new Ractive({
	target: '#container',
	template: '#template',
	data: {
		colors: [ 'red', 'green', 'blue' ],
		color: 'green'
	}
});