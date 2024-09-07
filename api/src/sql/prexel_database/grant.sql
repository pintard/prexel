GRANT ALL PRIVILEGES ON DATABASE prexeldb TO prexel_user;
-- Connect to the prexeldb database
\c prexeldb;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO prexel_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO prexel_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO prexel_user;