<?php
session_start();

// Connect to database
$db = mysqli_connect('localhost', 'root', 'Asri@21', 'miniproject');

// Check connection
if (!$db) {
    die("Connection failed: " . mysqli_connect_error());
}


// Get events data from POST request
$data = json_decode(file_get_contents('php://input'), true);

// Initialize array for response
$response = array();

// Retrieve email based on username
$username = $_SESSION['username'];
$query = "SELECT email FROM userdetails WHERE username = '$username'";
$result = mysqli_query($db, $query);
$user = mysqli_fetch_assoc($result);
$email = $user['email'];

// Prepare and execute SQL queries to insert events
foreach ($data as $date => $events) {
    foreach ($events as $event) {
        $event_title = mysqli_real_escape_string($db, $event);
        $event_date = mysqli_real_escape_string($db, $date);

        // Insert query
        $query = "INSERT INTO calendar (eventdate, username, email, eventtitle) 
                  VALUES ('$event_date', '$username', '$email', '$event_title')";
    
        // Execute the query
        $result = mysqli_query($db, $query);

        if ($result) {
            $response['success'] = true;
            $response['message'] = 'Events saved successfully';
        } else {
            $response['success'] = false;
            $response['message'] = 'Failed to save events';
            break 2; // Exit both loops if insertion fails
        }
    }
}

// Send response back to client
header('Content-Type: application/json');
echo json_encode($response);

mysqli_close($db);
?>
