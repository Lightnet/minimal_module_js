larger, more prominent title and description to distinguish it from topics and comments.
- **Topic Layout**: Topics are lighter (`#f9f9f9`) and more compact, with a clickable title and metadata for quick scanning.
- **Comment Layout**: Comments are nested within topics, with a clean, minimal design and interaction buttons for engagement.

### Sample HTML Structure
To demonstrate how the CSS applies, here’s a sample HTML structure integrating boards, topics, and comments:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forum with Boards, Topics, Comments</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="forum-container">
        <!-- Navigation -->
        <div class="nav-container">
            <div>
                <button class="nav-button active">All Boards</button>
                <button class="nav-button">My Boards</button>
            </div>
            <button class="theme-toggle">Toggle Theme</button>
        </div>

        <!-- Create Board Button -->
        <button class="create-forum-btn">Create New Board</button>

        <!-- Board -->
        <div class="board-container">
            <div class="board-header">
                <h2 class="board-title">General Discussion</h2>
                <div class="board-actions">
                    <button class="edit-btn" data-admin-only="true">Edit</button>
                    <button class="delete-btn" data-admin-only="true">Delete</button>
                </div>
            </div>
            <p class="board-description">A place for general discussions about various topics.</p>

            <!-- Topic List -->
            <ul class="topic-list">
                <li class="topic-item">
                    <div class="topic-header">
                        <h3 class="topic-title">Welcome to the Forum!</h3>
                        <div class="topic-actions">
                            <button class="edit-btn" data-admin-only="true">Edit</button>
                            <button class="delete-btn" data-admin-only="true">Delete</button>
                        </div>
                    </div>
                    <div class="topic-meta">Posted by <strong>John Doe</strong> on April 26, 2025</div>
                    <p class="topic-content">This is the first topic to get discussions started. Feel free to share your thoughts!</p>

                    <!-- Comment List -->
                    <ul class="comment-list">
                        <li class="comment-item">
                            <div class="comment-header">
                                <span class="comment-author">Jane Smith</span>
                                <div class="comment-actions">
                                    <button class="like-btn">Like</button>
                                    <button class="reply-btn">Reply</button>
                                </div>
                            </div>
                            <div class="comment-meta">Posted on April 26, 2025</div>
                            <p class="comment-content">Great topic! I'm excited to join the discussion.</p>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>

    <script>
        // Hide admin-only buttons for non-admins
        const isAdmin = false; // Replace with actual admin check
        document.querySelectorAll('[data-admin-only="true"]').forEach(btn => {
            if (!isAdmin) {
                btn.style.display = 'none';
            }
        });
    </script>
</body>
</html>