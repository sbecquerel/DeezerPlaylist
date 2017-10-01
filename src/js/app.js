App = function() {
  this.userId = null;
  this.playlist = new Playlist();  
  this.playerInitialized = false;
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
    });
    document.getElementById('interface').show();
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
  document.getElementById('login-btn').hide();
  document.getElementById('loading-msg').show();
  DZ.login((function(response) {
    if (response.authResponse) {
      DZ.api('/user/me', (function(response) {
        if (response.error) {
          document.getElementById('login-btn').show();
          document.getElementById('loading-msg').hide();
          return;
        }
        // If playerInitialized != false, player has to be initialized
        if ( ! this.playerInitialized) {
          DZ.init({
            player: {
              container: 'player',
              width : 800,
              height : 100,
              onload : (function() {                
                this.playerInitialized = true;
                this.afterLoggedIn(response.id);
              }).bind(this)
            }
          });
        } else {
          this.afterLoggedIn(response.id);
        }
      }).bind(this));
    } else {
      document.getElementById('login-btn').show();
      document.getElementById('loading-msg').hide();
    }
  // Needed authorization to manage playlist (add, delete).
  }).bind(this), {perms: 'basic_access,email,manage_library,delete_library'});
}

App.prototype.afterLoggedIn = function(userId) {
  document.getElementById('loading-msg').hide();
  document.getElementById('player').show();
  document.getElementById('logout-btn').show();
  document.getElementById('login-btn').hide();
  this.userId = userId;
  // Show playlist interface
  this.playlist.show();
}

App.prototype.logout = function() {
  this.userId = null;
  // The hide function will delete temporary
  // playlist. When it's done, we can disconnect
  // the user.
  this.playlist.hide(function() {
    DZ.logout();
  });  
  document.getElementById('logout-btn').hide();
  document.getElementById('login-btn').show();
  document.getElementById('player').hide();  
}