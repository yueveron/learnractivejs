//* Define : Partials
var thumbs = "<figure class='thumbnail'><img src='img/{{id}}.png'><figcaption>{{description}}</figcaption></figure>";

var ractive = new Ractive({
  el: '#container',
  template: '#template',
  partials: { thumbnail: thumbs },  // Reference thumbs to Partials
  data: { 
    items: [
      { id: 'africanviolet', description: 'African Violet' },
      { id: 'cactusflower', description: 'Cactus Flower' },
      { id: 'forestorchid', description: 'Forest Orchid' }
    ]
  }
});