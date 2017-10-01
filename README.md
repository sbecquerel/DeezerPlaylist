# DeezerPlaylist
## Usage
Launch the web server:  
`$ ./run.sh`

Open a browser and enter url: http://localhost

To stop the container: `$ ./stop.sh`

## Interface
Click on the *Login* button and enter your login/password in the popup window.  
![Login](https://raw.githubusercontent.com/sbecquerel/DeezerPlaylist/master/img/login.png)

After login, the playlist interface is shown as below.  
![Playlist](https://raw.githubusercontent.com/sbecquerel/DeezerPlaylist/master/img/playlist.png)

The system will automatically create a temporary playlist named **Test API**.
* To add a new track in the playlist, enter the track name in the search input, and select the track by clicking on it in the result list
* To remove a track, click on the cross next to the track name
* After adding or removing a track, click on the *refresh* button to refresh the playlist in the player
* Click on *logout* button to disconnect the user, and delete the temporary playlist
