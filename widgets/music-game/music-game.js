function setup() {
    document.getElementById('play').addEventListener('click', function() {
        $.ajax({
            url: 'https://api.spotify.com/v1/me/player/play',
            type: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "uris": [`spotify:track:${apiData.item.id}`],
                "position_ms": apiData.progress_ms
            })
        });
    });
    document.getElementById('pause').addEventListener('click', function() {
        $.ajax({
            url: 'https://api.spotify.com/v1/me/player/pause',
            type: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        });
    });
}