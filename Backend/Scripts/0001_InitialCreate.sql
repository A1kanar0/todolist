CREATE TABLE IF NOT EXISTS Notes (
    Id SERIAL PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Content TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Notes (Title, Content) VALUES ('Перша нотатка', 'Створено через DbUp!');