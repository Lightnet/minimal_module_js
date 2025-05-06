

 * https://www.postgresql.org/docs/12/libpq-connect.html#id-1.7.3.8.3.6
 * 

```
\pgsql\pgAdmin 4\runtime\pgAdmin4.exe
```
run pgAdmin4 for web database access interface.

# .env
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/postgres
```

```sql
INSERT INTO permissions (entity_type, entity_id, resource_type, resource_id, action, allowed)
VALUES ('user', '1', 'forum', NULL, 'create', true);
```