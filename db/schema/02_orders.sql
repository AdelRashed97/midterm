DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  telephone VARCHAR(255) NOT NULL,
  sumbitted_at TIMESTAMPZ DEFAULT NOW(),
  completed_at TIMESTAMPZ
);
