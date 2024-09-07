DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'prexel_user') THEN
        CREATE USER prexel_user WITH PASSWORD 'password';
    END IF;
END $$;

-- DO $$ BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'prexeldb') THEN
--         PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE prexeldb');
--     END IF;
-- END $$;

SELECT 'CREATE DATABASE prexeldb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'prexeldb')\gexec