CREATE TABLE presidentes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  votos INTEGER DEFAULT 0
);

CREATE TABLE votos_usuarios (
  id SERIAL PRIMARY KEY,
  rut TEXT NOT NULL,
  presidente_id INTEGER NOT NULL REFERENCES presidentes(id),
  UNIQUE (rut)
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre_usuario VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL,
  admin BOOLEAN DEFAULT FALSE,
  status BOOLEAN DEFAULT FALSE
);
