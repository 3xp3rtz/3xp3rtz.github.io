import os
import re
import spotipy
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyClientCredentials

load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID", "")
CLIENT_SECRET = os.getenv("CLIENT_SECRET", "")

url = 'https://open.spotify.com/playlist/3c4CpJqWnx8XlRm4gtPD8s?si=f57ee19bd1bc4460'

client_credentials_manager = SpotifyClientCredentials(client_id=CLIENT_ID,client_secret=CLIENT_SECRET)
session = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

uri = url.split('/playlist/')[1].split('?')[0]
tracks = session.playlist_tracks(uri)["items"]