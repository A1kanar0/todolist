DROP POLICY IF EXISTS hide_deleted_users ON users;

CREATE POLICY hide_deleted_users 
ON users 
FOR SELECT
USING (
    is_deleted = false
    OR current_setting('app.show_deleted', true) = 'true'
);
