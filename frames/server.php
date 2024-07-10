<?php
session_start();

// initializing variables
$username = "";
$email    = "";
$errors = array(); 

// connect to the database
$db = mysqli_connect('localhost', 'root', 'Asri@21', 'miniproject');

// REGISTER USER
if (isset($_POST['reg_user'])) {
  // receive all input values from the form
  $username = mysqli_real_escape_string($db, $_POST['username']);
  $email = mysqli_real_escape_string($db, $_POST['email']);
  $password = mysqli_real_escape_string($db, $_POST['password']);

  // form validation: ensure that the form is correctly filled ...
  // by adding (array_push()) corresponding error unto $errors array
  if (empty($username)) { array_push($errors, "Username is required"); }
  if (empty($email)) { array_push($errors, "Email is required"); }
  if (empty($password)) { array_push($errors, "Password is required"); }

  // first check the database to make sure 
  // a user does not already exist with the same username and/or email
  $user_check_query = "SELECT * FROM userdetails WHERE username='$username' OR email='$email' LIMIT 1";
  $result = mysqli_query($db, $user_check_query);
  $user = mysqli_fetch_assoc($result);
  
  if ($user) { // if user exists
    if ($user['username'] === $username) {
      array_push($errors, "Username already exists");
    }

    if ($user['email'] === $email) {
      array_push($errors, "Email already exists");
    }
  }

  // Finally, register user if there are no errors in the form
  if (count($errors) == 0) {
    $password = md5($password); //encrypt the password before saving in the database

    $query = "INSERT INTO userdetails (username, email, psswd) 
              VALUES('$username', '$email', '$password')";
    mysqli_query($db, $query);
    $_SESSION['username'] = $username;
    $_SESSION['email'] = $email; // Store email in session
    $_SESSION['success'] = "You are now logged in";
    header('location: index.php');
  }
}

// LOGIN USER
if (isset($_POST['login_user'])) {
  $username = mysqli_real_escape_string($db, $_POST['username']);
  $password = mysqli_real_escape_string($db, $_POST['password']);

  if (empty($username)) {
    array_push($errors, "Username is required");
  }
  if (empty($password)) {
    array_push($errors, "Password is required");
  }

  if (count($errors) == 0) {
    $password = md5($password);
    $query = "SELECT * FROM userdetails WHERE username='$username' AND psswd='$password'";
    $results = mysqli_query($db, $query);

    if (mysqli_num_rows($results) == 1) {
      $_SESSION['username'] = $username;
      $_SESSION['success'] = "You are now logged in";
      $user = mysqli_fetch_assoc($results);
      $_SESSION['email'] = $user['email']; // Store email in session
      header('location: frames.html');
    } else {
      array_push($errors, "Wrong username/password combination");
    }
  }
}

// SAVE EVENT
if (isset($_POST['save_event'])) {
  $eventDate = mysqli_real_escape_string($db, $_POST['eventDate']);
  $eventTitle = mysqli_real_escape_string($db, $_POST['eventTitle']);
  $email = $_SESSION['email']; // Fetch email from session
  $username = $_SESSION['username']; // Fetch username from session

  $query = "INSERT INTO calendar (eventdate, eventtitle, username, email) 
            VALUES('$eventDate', '$eventTitle', '$username', '$email')";
  mysqli_query($db, $query);
  echo "Event saved successfully";
  exit();
}


// SAVE NOTE
if (isset($_POST['save_note'])) {
  $title = mysqli_real_escape_string($db, $_POST['title']);
  $short_description = mysqli_real_escape_string($db, $_POST['short_description']);
  $email = $_SESSION['email']; // Fetch email from session
  $username = $_SESSION['username']; // Fetch username from session

  $query = "INSERT INTO notes (title, short_description, username, email) 
            VALUES('$title', '$short_description', '$username', '$email')";
  mysqli_query($db, $query);
  echo "Note saved successfully";
  exit();
}


?>
