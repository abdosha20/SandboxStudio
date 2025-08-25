<?php
// admin-dashboard.php
session_start();
require_once 'db.php';
if (!isset($_SESSION['admin_id'])) {
    header('Location: admin-login.php');
    exit;
}
// Filters
$where = [];
$params = [];
if (!empty($_GET['role'])) {
    $where[] = 'role = ?';
    $params[] = $_GET['role'];
}
if (!empty($_GET['status'])) {
    $where[] = 'status = ?';
    $params[] = $_GET['status'];
}
if (!empty($_GET['date'])) {
    $where[] = 'DATE(created_at) = ?';
    $params[] = $_GET['date'];
}
$sql = 'SELECT * FROM applications';
if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
$sql .= ' ORDER BY created_at DESC';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$applications = $stmt->fetchAll();
// Get unique roles/status for filters
$roles = $pdo->query('SELECT DISTINCT role FROM applications')->fetchAll(PDO::FETCH_COLUMN);
$statuses = ['Pending','Shortlisted','Rejected','Hired'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard - Sandbox Studio</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../careers.css">
</head>
<body>
    <main style="max-width: 1100px; margin: 2rem auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(42,122,226,0.07); padding: 2.5rem 2rem;">
        <h1>Applications Dashboard</h1>
        <form method="get" style="display:flex; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap;">
            <select name="role">
                <option value="">All Roles</option>
                <?php foreach ($roles as $r): ?>
                    <option value="<?= htmlspecialchars($r) ?>" <?= (($_GET['role'] ?? '') === $r) ? 'selected' : '' ?>><?= htmlspecialchars($r) ?></option>
                <?php endforeach; ?>
            </select>
            <select name="status">
                <option value="">All Statuses</option>
                <?php foreach ($statuses as $s): ?>
                    <option value="<?= $s ?>" <?= (($_GET['status'] ?? '') === $s) ? 'selected' : '' ?>><?= $s ?></option>
                <?php endforeach; ?>
            </select>
            <input type="date" name="date" value="<?= htmlspecialchars($_GET['date'] ?? '') ?>">
            <button type="submit" class="submit-btn">Filter</button>
            <a href="?" class="submit-btn" style="background:#eee;color:#222;">Reset</a>
        </form>
        <table style="width:100%; border-collapse:collapse;">
            <thead>
                <tr style="background:#f5f7fa;">
                    <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Date</th><th>Details</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($applications as $app): ?>
                <tr>
                    <td><?= $app['id'] ?></td>
                    <td><?= htmlspecialchars($app['full_name']) ?></td>
                    <td><?= htmlspecialchars($app['email']) ?></td>
                    <td><?= htmlspecialchars($app['role']) ?></td>
                    <td><?= htmlspecialchars($app['status']) ?></td>
                    <td><?= htmlspecialchars($app['created_at']) ?></td>
                    <td><a href="applicant-details.php?id=<?= $app['id'] ?>">View</a></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <form method="post" action="logout.php" style="margin-top:2rem;text-align:right;">
            <button type="submit" class="submit-btn" style="background:#b00;">Logout</button>
        </form>
    </main>
</body>
</html>
