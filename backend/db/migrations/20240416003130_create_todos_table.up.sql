CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY,
    todo TEXT NOT NULL,
    completed BOOL DEFAULT false
);
