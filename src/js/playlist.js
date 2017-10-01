Playlist = function() {
  this.playlistTitle = 'Test API';
  this.playlistId = null;
}

Playlist.prototype.init = function() {  
  var timeoutId;

  document.querySelector('#playlist h2').innerHTML = 'Playlist "' + this.playlistTitle + '" tracks';
  // Use setTimeout to prevent multiple calls to API
  document.getElementById('query-txt').addEventListener('keyup', (function() {  
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(this.Search.bind(this), 100);
  }.bind(this)));
  document.getElementById('refresh-btn').addEventListener('click', this.refresh.bind(this));
}

Playlist.prototype.refresh = function() {
  this.loadPlaylist();
  document.getElementById('refresh-btn').hide();
}

Playlist.prototype.show = function() {
  DZ.api('user/me/playlists', 'GET', (function(response) {
    if (response.error) {
      throw response.error;
    }
    var playLists = response.data;
    // Check if playlist exists, and use it if found
    for (var i in playLists) {
      if (playLists[i].title === this.playlistTitle) {
        this.initPlaylist(playLists[i].id);
        return;
      }
    }
    // Create playlist if not found
    DZ.api('user/me/playlists', 'POST', {title : this.playlistTitle}, (function(response) {
      if (response.error) {
        throw response.error;
      }
      this.initPlaylist(response.id);
    }).bind(this));
  }).bind(this));
}

Playlist.prototype.initPlaylist = function(playlistId) {
  this.playlistId = playlistId;  
  this.showTracks(true);
}

Playlist.prototype.loadPlaylist = function() {  
  DZ.player.playPlaylist(this.playlistId);
}

Playlist.prototype.onRemoveTrack = function(e) {  
  var a = e.target;
  var li = a.parentNode;
  var trackId = li.id;

  li.parentNode.removeChild(li);
  DZ.api('playlist/' + this.playlistId + '/tracks', 'DELETE', { songs: trackId }, (function(response) {
    if (response.error) {
      throw response.error;
    }
    if (document.querySelectorAll('#tracks ul li').length) {
      // Show refresh button if there is at least one track
      document.getElementById('refresh-btn').show();
    }    
  }).bind(this));
}

Playlist.prototype.showTracks = function(loadPlaylist) {
  loadPlaylist = loadPlaylist || false;

  // Get playlist tracks from API
  DZ.api('playlist/' + this.playlistId + '/tracks', 'GET', (function(response) {
    if (response.error) {
      throw response.error;
    }
    document.getElementById('playlist').show();
    document.getElementById('player').show();
    document.querySelector('#tracks ul').innerHTML = response.data      
    .map(function(track) {
      return '<li id="' + track.id + '">' + track.title + ' <a href="#" class="remove">x</a></li>';
    })
    .join(' ');
    document.querySelectorAll('#tracks ul li a').forEach(function(elt) {
      elt.addEventListener('click', this.onRemoveTrack.bind(this));      
    }, this);
    // If first call (initializaion), play the playlist
    if (loadPlaylist) {
      this.loadPlaylist();
    // Else show the refresh button to refresh playlist and doesn't interrupt current playing
    } else {
      document.getElementById('refresh-btn').show();
    }
  }).bind(this));
}

Playlist.prototype.hide = function(callback) {
  DZ.player.pause();
  // Delete temporary playlist
  // The callback is used to disconnect the user after deletion
  DZ.api('playlist/' + this.playlistId, 'DELETE', function(response) {
    callback();
  });  
  document.getElementById('playlist').hide();
  document.getElementById('player').hide();  
  document.getElementById('refresh-btn').hide();
}

Playlist.prototype.Search = function() {
  var query = document.getElementById('query-txt').value;

  if (query.length) {
    DZ.api('search?q=' + query, 'GET', (function(response) {
      if (response.error) {
        throw response.error;
      }
      if ( ! response.data.length) {
        document.getElementById('results').hide();
        return;
      }
      document.getElementById('results').show();
      document.querySelector('#results ul').innerHTML = response.data      
        .map(function(track) {
          return '<li id="' + track.id + '">' + track.title + '</li>';
        })
        .join(' ');
      document.querySelectorAll('#results ul li').forEach(function(elt) {
        elt.addEventListener('click', (function(e) {
          DZ.api('playlist/' + this.playlistId + '/tracks', 'POST', { songs: e.target.id }, (function(response) {
            this.showTracks();            
          }).bind(this));
          document.getElementById('results').hide();
          document.getElementById('query-txt').value = '';
        }).bind(this));
      }, this);
    }).bind(this));
  }
}
