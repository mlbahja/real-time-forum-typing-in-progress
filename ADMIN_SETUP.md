# Admin Panel Setup Guide

## Making Yourself an Admin

### Option 1: Using SQLite Command Line (Local Development)

1. Open the database:
```bash
sqlite3 database/forum.db
```

2. Find your user ID:
```sql
SELECT user_id, username FROM users;
```

3. Make yourself admin (replace `your_username` with your actual username):
```sql
UPDATE users SET is_admin = 1 WHERE username = 'your_username';
```

4. Verify:
```sql
SELECT user_id, username, is_admin FROM users WHERE is_admin = 1;
```

5. Exit SQLite:
```sql
.quit
```

### Option 2: Using Railway/Cloud Database

Since Railway doesn't provide direct database access, you'll need to:

1. **Temporary Admin Endpoint**: I can add a one-time setup endpoint that makes the first registered user an admin
2. **Or**: Deploy locally first, make yourself admin, then push the database

### Option 3: Direct SQL in Production (Recommended for Railway)

Add this to your backend temporarily:

1. Create a one-time setup route that you can call once
2. After making yourself admin, remove the route

## Accessing Admin Panel

Once you're an admin:

1. Login to your account
2. Navigate to: `http://your-domain.com/admin`
3. You'll see the admin dashboard with:
   - User statistics
   - User management (view all users, make/remove admins)
   - Post management (view all posts, delete posts)
   - Comment management (delete comments)

## Admin Features

### Dashboard Stats
- Total users count
- Total posts count
- Total comments count

### User Management
- View all registered users
- See who is admin
- Promote users to admin
- Demote admins to regular users

### Content Moderation
- View all posts across the forum
- Delete inappropriate posts
- Delete inappropriate comments
- Posts are deleted with CASCADE, removing associated comments and reactions

## Security Notes

1. Admin routes are protected by middleware that checks `is_admin` status
2. Only logged-in admins can access `/admin/*` endpoints
3. Regular users attempting to access admin routes get a 403 Forbidden error
4. Never share your admin credentials

## API Endpoints (Admin Only)

All require authentication cookie:

- `GET /admin/stats` - Get dashboard statistics
- `GET /admin/users` - Get all users
- `GET /admin/posts` - Get all posts
- `DELETE /admin/delete-post?post_id=X` - Delete a post
- `DELETE /admin/delete-comment?comment_id=X` - Delete a comment
- `POST /admin/toggle-admin` - Toggle user admin status
  ```json
  {
    "user_id": 123,
    "is_admin": true
  }
  ```
