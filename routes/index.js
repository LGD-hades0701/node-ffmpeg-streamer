var spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    request = require('request');

/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Youtube MP3' });
};

// based on http://pauldbergeron.com/blog/2011/12/28/streaming-youtube-to-mp3-audio-in-nodejs
exports.youtube_mp3 = function(req, res){
    var youtube_dl_cmd = 'youtube-dl --simulate --get-url ';
    youtube_dl_cmd += 'http://youtube.com/watch?v=' + req.params.video_id;

    youtube_dl_child = exec(youtube_dl_cmd, function(err, stdout, stderr){
        video_url = stdout.toString();
        video_url = video_url.substring(0, video_url.length - 1); // remove trailing \n

        res.contentType = 'audio/mpeg3';

        var ffmpeg_args = [
            '-i',
            'pipe:0',
            '-acodec',
            'libmp3lame',
            '-f',
            'mp3',
            '-'
        ];

        ffmpeg_child = spawn('ffmpeg', ffmpeg_args);
        ffmpeg_child.stdout.pipe(res);

        request({
            'url': video_url,
            'headers': { 'Youtubedl-no-compression': true }
        }).pipe(ffmpeg_child.stdin);
    });
};

exports.sapovideos_mp3 = function(req, res){
        res.contentType = 'audio/mpeg3';
        var video_url = 'http://videos.sapo.pt/' + req.params.video_id + '/mov/1';

        var ffmpeg_args = [
            '-i',
            'pipe:0',
            '-acodec',
            'libmp3lame',
            '-f',
            'mp3',
            '-'
        ];

        ffmpeg_child = spawn('ffmpeg', ffmpeg_args);
        ffmpeg_child.stdout.pipe(res);

        request({
            'url': video_url
        }).pipe(ffmpeg_child.stdin);
};
