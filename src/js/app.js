App = function() {
  this.userId = null;
  this.playlist = new Playlist();  
}

App.prototype.init = function() {
  this.initDZ();  
  window.onload = this.initApp.bind(this);  
}

App.prototype.initDZ = function() {
  window.dzAsyncInit = (function() {
    DZ.init({
      appId  : '254142',
      channelUrl : 'http://localhost/channel.php',
      player: {
        container: 'player',
        width : 800,
        height : 100,
        onload : function() {
          document.getElementById('interface').show();
        }
      }
    });
  }).bind(this);
    
  var e = document.createElement('script');
  e.src = 'https://e-cdns-files.dzcdn.net/js/min/dz.js';
  e.async = true;
  document.getElementById('dz-root').appendChild(e);
}

App.prototype.initApp = function() {
  document.getElementById('login-btn').addEventListener('click', this.login.bind(this));
  document.getElementById('logout-btn').addEventListener('click', this.logout.bind(this));
  this.playlist.init();
}

App.prototype.login = function() {
  DZ.login((function(response) {
    if (response.authResponse) {
      document.getElementById('logout-btn').show();
      document.getElementById('login-btn').hide();      
      DZ.api('/user/me', (function(response) {
        this.userId = response.id;
        this.playlist.show();
      }).bind(this));
    }
  }).bind(this), {perms: 'basic_access,email,manage_library,delete_library'});
}

App.prototype.logout = function() {
  this.userId = null;
  this.playlist.hide();
  DZ.logout();
  document.getElementById('logout-btn').hide();
  document.getElementById('login-btn').show();
}
