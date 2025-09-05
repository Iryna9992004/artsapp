#!/bin/bash
source ../.env

clickhouse-migrations migrate --host $CLICKHOUSE_HOST --user $CLICKHOUSE_USER --password $CLICKHOUSE_PASSWORD --db $CLICKHOUSE_DB --migrations-home $CLICKHOUSE_MIGRATIONS_DIR