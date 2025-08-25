<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Debug: print POST and FILES if needed
// echo '<pre>'; print_r($_POST); print_r($_FILES); echo '</pre>'; // Uncomment for debugging
// application-submit.php - Handles careers.html form POST
session_start();
require_once 'db.php';

function sanitize($str) {
    return htmlspecialchars(trim($str), ENT_QUOTES, 'UTF-8');
}

// Validate POST
$required = ['fullname','email','phone','role','why','skills'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        exit('Missing required field: ' . $field);
    }
}

$full_name = sanitize($_POST['fullname']);
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ? $_POST['email'] : '';
$phone = sanitize($_POST['phone']);
$role = sanitize($_POST['role']);
$portfolio_url = isset($_POST['portfolio']) ? sanitize($_POST['portfolio']) : '';
$motivation = sanitize($_POST['why']);
$skills = sanitize($_POST['skills']);

if (!$email) {
    http_response_code(400);
    exit('Invalid email address.');
}

// File upload handling
$cv_filename = $video_filename = '';
$upload_dir = __DIR__ . '/uploads/';
if (!is_dir($upload_dir)) mkdir($upload_dir, 0775, true);

// CV/Resume: required
if (!isset($_FILES['cv']) || $_FILES['cv']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    exit('CV/Resume upload failed.');
}
$cv = $_FILES['cv'];
$cv_ext = strtolower(pathinfo($cv['name'], PATHINFO_EXTENSION));
$allowed_cv = ['pdf','docx','zip'];
if (!in_array($cv_ext, $allowed_cv) || $cv['size'] > 10*1024*1024) {
    http_response_code(400);
    exit('Invalid CV file.');
}
$cv_filename = uniqid('cv_') . '.' . $cv_ext;
move_uploaded_file($cv['tmp_name'], $upload_dir . $cv_filename);

// Video: optional
if (isset($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
    $video = $_FILES['video'];
    $video_ext = strtolower(pathinfo($video['name'], PATHINFO_EXTENSION));
    $allowed_video = ['mp4','mov'];
    if (!in_array($video_ext, $allowed_video) || $video['size'] > 50*1024*1024) {
        http_response_code(400);
        exit('Invalid video file.');
    }
    $video_filename = uniqid('video_') . '.' . $video_ext;
    move_uploaded_file($video['tmp_name'], $upload_dir . $video_filename);
}

// Insert into DB
$stmt = $pdo->prepare('INSERT INTO applications (full_name, email, phone, role, portfolio_url, motivation, skills, cv_filename, video_filename, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
$stmt->execute([
    $full_name, $email, $phone, $role, $portfolio_url, $motivation, $skills, $cv_filename, $video_filename, 'Pending'
]);

// Send confirmation email (simple mail)
$to = $email;
$subject = 'Sandbox Studio Application Received';
$message = "Thank you for applying to Sandbox Studio! We have received your application and will contact you if shortlisted.";
$headers = 'From: careers@sandboxstudio.com';
@mail($to, $subject, $message, $headers);

header('Location: application-success.html');
exit;
