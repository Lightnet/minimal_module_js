```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forum Post Layout</title>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.6.0/css/all.css" crossorigin="anonymous">
  <link rel="stylesheet" href="styles.css"> <!-- Your CSS file -->
</head>
<body>
  <!-- Sidebar -->
  <div class="sidebar">
    <div class="sidebar-item" title="Home"><i class="fas fa-home"></i></div>
    <div class="sidebar-item" title="Forums"><i class="fas fa-comments"></i></div>
    <div class="sidebar-item" title="Profile"><i class="fas fa-user"></i></div>
    <div class="theme-toggle-container">
      <input type="checkbox" id="theme-toggle" class="theme-toggle">
      <label for="theme-toggle"></label>
    </div>
  </div>

  <!-- Main Content -->
  <div class="main-content">
    <!-- Forum Layout -->
    <div class="forum-container">
      <div class="nav-container">
        <div>
          <button class="nav-button active">All Forums</button>
          <button class="nav-button">My Forums</button>
        </div>
        <div class="theme-toggle-container">
          <input type="checkbox" id="forum-theme-toggle" class="theme-toggle">
          <label for="forum-theme-toggle"></label>
        </div>
      </div>
      <button class="create-forum-btn">Create New Forum</button>
      <ul class="forum-list">
        <li class="forum-item">
          <div class="forum-header">
            <h2 class="forum-title">General Discussion</h2>
            <div class="action-buttons" data-admin-only="true">
              <button class="edit-btn"><i class="fas fa-pen-to-square"></i> Edit</button>
              <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
            </div>
          </div>
          <div class="forum-content">
            A place for general conversations and community updates.
          </div>
        </li>
        <li class="forum-item">
          <div class="forum-header">
            <h2 class="forum-title">Tech Support</h2>
            <div class="action-buttons" data-admin-only="true">
              <button class="edit-btn"><i class="fas fa-pen-to-square"></i> Edit</button>
              <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
            </div>
          </div>
          <div class="forum-content">
            Get help with technical issues and troubleshooting.
          </div>
        </li>
      </ul>
    </div>

    <!-- Board Layout -->
    <div class="board-container">
      <div class="board-header">
        <h1 class="board-title">General Discussion</h1>
        <div class="board-actions">
          <button class="create-topic-btn">Create New Topic</button>
        </div>
      </div>
      <div class="board-description">
        Welcome to the General Discussion board! Share your thoughts and connect with the community.
      </div>
      <ul class="topic-list">
        <li class="topic-item">
          <div class="topic-header">
            <h2 class="topic-title">Welcome Thread</h2>
            <div class="topic-actions">
              <button class="edit-btn"><i class="fas fa-pen-to-square"></i> Edit</button>
              <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
            </div>
          </div>
          <div class="topic-meta">
            Posted by <strong>Admin</strong> on April 27, 2025
          </div>
          <div class="topic-content">
            Introduce yourself and say hello to the community!
          </div>
        </li>
      </ul>
    </div>

    <!-- Topic Layout -->
    <div class="board-container">
      <div class="board-header">
        <h1 class="board-title">Welcome Thread</h1>
        <div class="board-actions">
          <button class="reply-topic-btn">Reply to Topic</button>
        </div>
      </div>
      <div class="topic-item">
        <div class="topic-header">
          <h2 class="topic-title">Welcome Thread</h2>
          <div class="topic-actions">
            <button class="edit-btn"><i class="fas fa-pen-to-square"></i> Edit</button>
            <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
        <div class="topic-meta">
          Posted by <strong>Admin</strong> on April 27, 2025
        </div>
        <div class="topic-content">
          Introduce yourself and say hello to the community! This is the place to get started.
        </div>
      </div>

      <!-- Comments Layout -->
      <ul class="comment-list">
        <li class="comment-item">
          <div class="comment-header">
            <span class="comment-author">JohnDoe</span>
            <span class="comment-meta">Posted on April 27, 2025 at 10:30 AM</span>
          </div>
          <div class="comment-content">
            Hi everyone! Excited to join the community.
          </div>
          <div class="comment-actions">
            <button class="like-btn" aria-label="Like comment">
              <i class="fas fa-thumbs-up"></i> Like
            </button>
            <button class="dislike-btn" aria-label="Dislike comment">
              <i class="fas fa-thumbs-down"></i> Dislike
            </button>
            <button class="edit-btn" aria-label="Edit comment">
              <i class="fas fa-pen-to-square"></i> Edit
            </button>
            <button class="delete-btn" aria-label="Delete comment">
              <i class="fas fa-trash"></i> Delete
            </button>
            <button class="reply-btn" aria-label="Reply to comment">
              <i class="fas fa-reply"></i> Reply
            </button>
          </div>
        </li>
        <li class="comment-item">
          <div class="comment-header">
            <span class="comment-author">JaneSmith</span>
            <span class="comment-meta">Posted on April 27, 2025 at 11:00 AM</span>
          </div>
          <div class="comment-content">
            Welcome, John! Great to have you here.
          </div>
          <div class="comment-actions">
            <button class="like-btn" aria-label="Like comment">
              <i class="fas fa-thumbs-up"></i> Like
            </button>
            <button class="dislike-btn" aria-label="Dislike comment">
              <i class="fas fa-thumbs-down"></i> Dislike
            </button>
            <button class="edit-btn" aria-label="Edit comment">
              <i class="fas fa-pen-to-square"></i> Edit
            </button>
            <button class="delete-btn" aria-label="Delete comment">
              <i class="fas fa-trash"></i> Delete
            </button>
            <button class="reply-btn" aria-label="Reply to comment">
              <i class="fas fa-reply"></i> Reply
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- Create Forum Modal -->
  <div id="CreateForumModal" style="display: none;">
    <form id="createForumForm">
      <div class="modal-form-group">
        <label for="forumTitle">Forum Title</label>
        <input type="text" id="forumTitle" placeholder="Enter forum title">
      </div>
      <div class="modal-form-group">
        <label for="forumDescription">Description</label>
        <textarea id="forumDescription" placeholder="Enter forum description"></textarea>
      </div>
      <div class="modal-actions">
        <button type="button" class="cancel-btn">Cancel</button>
        <button type="submit" class="submit-btn">Create Forum</button>
      </div>
    </form>
  </div>

  <script src="scripts.js"></script> <!-- Your JavaScript file -->
</body>
</html>
```