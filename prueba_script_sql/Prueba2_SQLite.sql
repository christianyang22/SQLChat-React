CREATE TABLE marcas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

CREATE TABLE categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

CREATE TABLE instrumentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    id_marca INTEGER,
    id_categoria INTEGER,
    precio REAL,
    stock INTEGER,
    FOREIGN KEY (id_marca) REFERENCES marcas(id),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);

CREATE TABLE clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE,
    telefono TEXT
);

CREATE TABLE alquileres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER,
    fecha_alquiler DATE,
    fecha_devolucion DATE,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

CREATE TABLE detalle_alquiler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_alquiler INTEGER,
    id_instrumento INTEGER,
    cantidad INTEGER,
    FOREIGN KEY (id_alquiler) REFERENCES alquileres(id),
    FOREIGN KEY (id_instrumento) REFERENCES instrumentos(id)
);

INSERT INTO marcas (nombre) VALUES ('Yamaha'), ('Fender'), ('Steinway');
INSERT INTO categorias (nombre) VALUES ('Guitarra'), ('Piano'), ('Viento');

INSERT INTO instrumentos (nombre, id_marca, id_categoria, precio, stock) VALUES
('Guitarra Acústica', 1, 1, 300.00, 7),
('Piano de Cola', 3, 2, 5000.00, 2),
('Trompeta', 1, 3, 200.00, 5);

INSERT INTO clientes (nombre, email, telefono) VALUES
('Sara Gómez', 'sara@email.com', '699888777'),
('David Robles', 'david@email.com', '688555444');

INSERT INTO alquileres (id_cliente, fecha_alquiler, fecha_devolucion) VALUES
(1, '2024-06-30', '2024-07-05'),
(2, '2024-07-02', NULL);

INSERT INTO detalle_alquiler (id_alquiler, id_instrumento, cantidad) VALUES
(1, 1, 1),
(1, 2, 1),
(2, 3, 2);