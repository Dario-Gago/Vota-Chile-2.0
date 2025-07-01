CREATE TABLE presidentes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT,
  votos INTEGER DEFAULT 0
);

CREATE TABLE votos_usuarios (
  id SERIAL PRIMARY KEY,
  rut TEXT NOT NULL,
  presidente_id INTEGER NOT NULL,
  UNIQUE (rut),
  CONSTRAINT votos_usuarios_presidente_id_fkey FOREIGN KEY (presidente_id)
    REFERENCES presidentes(id) ON DELETE CASCADE
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

CREATE TABLE configuracion (
  id SERIAL PRIMARY KEY,
  nombre_evento VARCHAR(255),
  fecha_inicio TIMESTAMP
);
CREATE TABLE elecciones (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL
);
