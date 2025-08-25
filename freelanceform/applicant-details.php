<?php
// applicant-details.php
session_start();
require_once 'db.php';
if (!isset($_SESSION['admin_id'])) {
    header('Location: admin-login.php');
    exit;
}
$id = intval($_GET['id'] ?? 0);
$stmt = $pdo->prepare('SELECT * FROM applications WHERE id = ?');
$stmt->execute([$id]);
$app = $stmt->fetch();
if (!$app) { echo 'Application not found.'; exit; }
// Handle status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['status'])) {
    $new_status = $_POST['status'];
    $allowed = ['Pending','Shortlisted','Rejected','Hired'];
    if (in_array($new_status, $allowed)) {
        $pdo->prepare('UPDATE applications SET status = ? WHERE id = ?')->execute([$new_status, $id]);
        header('Location: applicant-details.php?id=' . $id);
        exit;
    }
}
$cv_url = 'uploads/' . htmlspecialchars($app['cv_filename']);
$video_url = $app['video_filename'] ? 'uploads/' . htmlspecialchars($app['video_filename']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Applicant Details - Sandbox Studio</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../careers.css">
</head>
<body>
    <main style="max-width: 700px; margin: 2rem auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(42,122,226,0.07); padding: 2.5rem 2rem;">
        <h1>Applicant Details</h1>
        <table style="width:100%;margin-bottom:2rem;">
            <tr><th>Name:</th><td><?= htmlspecialchars($app['full_name']) ?></td></tr>
            <tr><th>Email:</th><td><?= htmlspecialchars($app['email']) ?></td></tr>
            <tr><th>Phone:</th><td><?= htmlspecialchars($app['phone']) ?></td></tr>
            <tr><th>Role:</th><td><?= htmlspecialchars($app['role']) ?></td></tr>
            <tr><th>Portfolio:</th><td><?= htmlspecialchars($app['portfolio_url']) ?></td></tr>
            <tr><th>Motivation:</th><td><?= nl2br(htmlspecialchars($app['motivation'])) ?></td></tr>
            <tr><th>Skills:</th><td><?= nl2br(htmlspecialchars($app['skills'])) ?></td></tr>
            <tr><th>CV/Resume:</th><td><a href="<?= $cv_url ?>" download>Download CV</a></td></tr>
            <tr><th>Video:</th><td><?= $video_url ? '<a href="' . $video_url . '" download>Download Video</a>' : 'N/A' ?></td></tr>
            <tr><th>Status:</th><td><?= htmlspecialchars($app['status']) ?></td></tr>
            <tr><th>Submitted:</th><td><?= htmlspecialchars($app['created_at']) ?></td></tr>
        </table>
        <form method="post" style="display:flex;gap:1rem;align-items:center;">
            <label for="status">Update Status:</label>
            <select name="status" id="status">
                <?php foreach(['Pending','Shortlisted','Rejected','Hired'] as $s): ?>
                    <option value="<?= $s ?>" <?= ($app['status'] === $s) ? 'selected' : '' ?>><?= $s ?></option>
                <?php endforeach; ?>
            </select>
            <button type="submit" class="submit-btn">Save</button>
        </form>
        <div style="margin-top:2rem;"><a href="admin-dashboard.php">&larr; Back to Dashboard</a></div>
    </main>
</body>
</html>
