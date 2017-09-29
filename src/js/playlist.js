Playlist = function() {
  this.playlistTitle = 'TEST_340304';
  this.playlistId = null;
}

Playlist.prototype.init = function() {  
  var timeoutId;

  document.getElementById('query-txt').addEventListener('keyup', (function() {  
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(this.Search.bind(this), 100);
  }.bind(this)));
}

Playlist.prototype.show = function() {
  DZ.api('user/me/playlists', 'GET', (function(response) {
    if (response.error) {
      throw response.error;
    }
    var playLists = response.data;
    for (var i in playLists) {
      if (playLists[i].title === this.playlistTitle) {
        this.initPlaylist(playLists[i].id);
        return;
      }
    }
    // Create playlist
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
  this.reloadPlaylist();
  this.showTracks();
}

Playlist.prototype.reloadPlaylist = function() {  
  DZ.player.playPlaylist(this.playlistId, false);
}

Playlist.prototype.onRemoveTrack = function(e) {  
  var a = e.target;
  var li = a.parentNode;
  var trackId = li.id;

  li.parentNode.removeChild(li);
  a.removeEventListener('click', this.onRemoveTrack.bind(this));
  DZ.api('playlist/' + this.playlistId + '/tracks', 'DELETE', { songs: trackId }, (function(response) {
    if (response.error) {
      throw response.error;
    }
    this.reloadPlaylist();
  }).bind(this));
}

Playlist.prototype.showTracks = function() {
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
  }).bind(this));
}

Playlist.prototype.hide = function() {
  DZ.player.pause();
  DZ.api('playlist/' + this.playlistId, 'DELETE', function(response) {

  });
  document.getElementById('playlist').hide();
  document.getElementById('player').hide();  
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
            this.reloadPlaylist();
          }).bind(this));
          document.getElementById('results').hide();
          document.getElementById('query-txt').value = '';
        }).bind(this));
      }, this);
    }).bind(this));
  }
}
