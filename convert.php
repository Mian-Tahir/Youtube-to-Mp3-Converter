<?php
header('Content-Type: application/json');

// Set your directory paths
$videoDir = 'videos/';
$mp3Dir = 'mp3s/';

// Create directories if they don't exist
if (!is_dir($videoDir)) mkdir($videoDir, 0755, true);
if (!is_dir($mp3Dir)) mkdir($mp3Dir, 0755, true);

function getYouTubeVideoInfo($url) {
    global $videoDir;
    
    $command = escapeshellcmd("yt-dlp --print-json -F $url");
    $output = shell_exec($command);
    
    if (!$output) {
    return null;
    }
    
    $videoInfo = json_decode($output, true);
    $formats = [];
    if (isset($videoInfo['formats'])) {
    foreach ($videoInfo['formats'] as $format) {
    if (strpos($format['ext'], 'mp4') !== false && isset($format['filesize'])) {
     $formats[] = [
    'format' => $format['format'],
    'filesize' => round($format['filesize'] / 1048576, 2) . ' MB', // Convert to MB
     'quality' => $format['format_note']
     ];
    }
    }
    }
    
    return [
    'title' => $videoInfo['title'],
    'formats' => $formats,
    'videoId' => $videoInfo['id']
    ];
    }
    

function convertVideoToMP3($url, $quality) {
global $videoDir, $mp3Dir;

$videoInfo = getYouTubeVideoInfo($url);
if (!$videoInfo) {
return null;
}

$videoId = $videoInfo['id'];
$videoTitle = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $videoInfo['title']);
$videoFilePath = $videoDir . $videoId . '.mp4';
$mp3FilePath = $mp3Dir . $videoId . '.mp3';

$command = escapeshellcmd("yt-dlp -f bestvideo+bestaudio --merge-output-format mp4 -o \"$videoFilePath\" $url");
shell_exec($command);

$command = escapeshellcmd("yt-dlp -x --audio-format mp3 --audio-quality $quality -o \"$mp3FilePath\" $url");
shell_exec($command);

return $mp3FilePath;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
$url = filter_var($_POST['url'], FILTER_SANITIZE_URL);
$quality = filter_var($_POST['quality'], FILTER_SANITIZE_STRING);

if (empty($url) || empty($quality)) {
echo json_encode(['error' => 'Invalid input']);
exit();
}

$mp3FilePath = convertVideoToMP3($url, $quality);

if ($mp3FilePath) {
echo json_encode(['success' => true, 'file' => basename($mp3FilePath)]);
} else {
echo json_encode(['error' => 'Failed to convert video']);
 }
}
?>