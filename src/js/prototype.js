Element.prototype.hide = function() {
  this.classList.add('hidden');
}

Element.prototype.show = function() {
  this.classList.remove('hidden');
}