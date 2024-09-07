REVOKE CONNECT ON DATABASE prexeldb FROM PUBLIC;
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'prexeldb'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS prexeldb;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'prexel_user') THEN
        DROP USER prexel_user;
    END IF;
END $$;
