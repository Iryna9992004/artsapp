-- Create publication for ClickHouse MaterializedPostgreSQL replication
CREATE PUBLICATION clickhouse_publication FOR ALL TABLES;

-- Grant replication privileges
ALTER USER postgres WITH REPLICATION;


