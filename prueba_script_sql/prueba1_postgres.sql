CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    presupuesto DECIMAL(12,2) DEFAULT 0
);

CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(80) UNIQUE,
    fecha_ingreso DATE NOT NULL,
    salario DECIMAL(10,2),
    id_departamento INT,
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id)
);

CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    presupuesto DECIMAL(12,2),
    id_departamento INT,
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id)
);

CREATE TABLE asignaciones (
    id SERIAL PRIMARY KEY,
    id_empleado INT,
    id_proyecto INT,
    fecha_asignacion DATE,
    rol VARCHAR(50),
    FOREIGN KEY (id_empleado) REFERENCES empleados(id),
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id)
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20),
    pais VARCHAR(50)
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    categoria VARCHAR(50),
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0
);

CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    id_cliente INT,
    id_producto INT,
    cantidad INT NOT NULL,
    fecha DATE NOT NULL,
    importe_total DECIMAL(12,2),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- Insertar departamentos
INSERT INTO departamentos (nombre, presupuesto)
SELECT
    'Departamento ' || i,
    50000 + (i * 1200)
FROM generate_series(1,100) as s(i);

-- Insertar empleados
INSERT INTO empleados (nombre, email, fecha_ingreso, salario, id_departamento)
SELECT
    'Empleado ' || i,
    'empleado' || i || '@empresa.com',
    DATE '2018-01-01' + ((i-1) * INTERVAL '10 days'),
    1800 + (i * 10),
    ((i - 1) % 100) + 1
FROM generate_series(1,100) as s(i);

-- Insertar proyectos
INSERT INTO proyectos (nombre, fecha_inicio, fecha_fin, presupuesto, id_departamento)
SELECT
    'Proyecto ' || i,
    DATE '2023-01-01' + ((i-1) * INTERVAL '5 days'),
    DATE '2023-06-01' + ((i-1) * INTERVAL '7 days'),
    15000 + (i * 500),
    ((i - 1) % 100) + 1
FROM generate_series(1,100) as s(i);

-- Insertar clientes
INSERT INTO clientes (nombre, email, telefono, pais)
SELECT
    'Cliente ' || i,
    'cliente' || i || '@clientes.com',
    '+34 600 100 ' || lpad(i::text, 3, '0'),
    CASE WHEN i % 3 = 0 THEN 'España' WHEN i % 3 = 1 THEN 'Portugal' ELSE 'Francia' END
FROM generate_series(1,100) as s(i);

-- Insertar productos
INSERT INTO productos (nombre, categoria, precio, stock)
SELECT
    'Producto ' || i,
    CASE WHEN i % 2 = 0 THEN 'Informática' ELSE 'Oficina' END,
    10 + (i * 3.5),
    50 + i
FROM generate_series(1,100) as s(i);

-- Insertar asignaciones
INSERT INTO asignaciones (id_empleado, id_proyecto, fecha_asignacion, rol)
SELECT
    ((random() * 99)::int + 1),
    ((random() * 99)::int + 1),
    DATE '2023-02-01' + (i * INTERVAL '3 days'),
    CASE WHEN i % 4 = 0 THEN 'Analista'
         WHEN i % 4 = 1 THEN 'Jefe de Proyecto'
         WHEN i % 4 = 2 THEN 'Técnico'
         ELSE 'Consultor'
    END
FROM generate_series(1,100) as s(i);

-- Insertar ventas (versión corregida, usando el id_producto generado en el select)
INSERT INTO ventas (id_cliente, id_producto, cantidad, fecha, importe_total)
SELECT
    idc, idp, cantidad, fecha, (10 + idp * 3.5) * cantidad
FROM (
    SELECT
        ((random() * 99)::int + 1) AS idc,
        ((random() * 99)::int + 1) AS idp,
        ((random() * 4)::int + 1) AS cantidad,
        DATE '2024-01-01' + (i * INTERVAL '1 day') AS fecha
    FROM generate_series(1,1000) as s(i)
) as t;