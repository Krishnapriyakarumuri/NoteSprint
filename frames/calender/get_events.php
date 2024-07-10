<?php
session_start();

// Connect to database
$db = mysqli_connect('localhost', 'root', 'Asri@21', 'miniproject');

// Check connection
if (!$db) {
    die("Connection failed: " . mysqli_connect_error());
}

// Retrieve email based on username
$username = $_SESSION['username'];
$query = "SELECT * FROM calendar WHERE username = '$username'";
$result = mysqli_query($db, $query);

// Initialize array for events
$events = array();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $date = $row['eventdate'];
        $title = $row['eventtitle'];
        if (!isset($events[$date])) {
            $events[$date] = array();
        }
        $events[$date][] = $title;
    }
}

// Send events back to client
$response = array();
$response['success'] = true;
$response['events'] = $events;

header('Content-Type: application/json');
echo json_encode($response);

mysqli_close($db);
?>
