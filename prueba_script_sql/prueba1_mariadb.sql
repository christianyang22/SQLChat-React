CREATE TABLE departamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    presupuesto DECIMAL(12,2) DEFAULT 0
);

CREATE TABLE empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(80) UNIQUE,
    fecha_ingreso DATE NOT NULL,
    salario DECIMAL(10,2),
    id_departamento INT,
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id)
);

CREATE TABLE proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    presupuesto DECIMAL(12,2),
    id_departamento INT,
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id)
);

CREATE TABLE asignaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT,
    id_proyecto INT,
    fecha_asignacion DATE,
    rol VARCHAR(50),
    FOREIGN KEY (id_empleado) REFERENCES empleados(id),
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id)
);

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20),
    pais VARCHAR(50)
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    categoria VARCHAR(50),
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0
);

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_producto INT,
    cantidad INT NOT NULL,
    fecha DATE NOT NULL,
    importe_total DECIMAL(12,2),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

INSERT INTO departamentos (nombre, presupuesto) VALUES
('Dirección', 75000),
('Comercial', 52000),
('Informática', 68000),
('Marketing', 47000),
('Legal', 56000),
('Logística', 39000),
('Finanzas', 63000),
('Compras', 46000),
('RRHH', 51000),
('Operaciones', 72000),
('Innovación', 81000),
('Soporte', 37000),
('Producción', 88000),
('Expansión', 42000),
('Calidad', 59000),
('Proyectos', 70000),
('Control', 53000),
('Infraestructura', 61000),
('Auditoría', 40000),
('Mantenimiento', 60000);

INSERT INTO empleados (nombre, email, fecha_ingreso, salario, id_departamento) VALUES
('Ana Ruiz', 'ana.ruiz@empresa.com', '2019-01-01', 1850, 1),
('Pedro López', 'pedro.lopez@empresa.com', '2019-02-11', 2000, 2),
('Laura García', 'laura.garcia@empresa.com', '2019-03-21', 2050, 3),
('Miguel Torres', 'miguel.torres@empresa.com', '2019-04-10', 1950, 4),
('Sara Fernández', 'sara.fernandez@empresa.com', '2019-05-05', 2100, 5),
('Carlos Romero', 'carlos.romero@empresa.com', '2019-06-15', 1980, 6),
('Sonia Martín', 'sonia.martin@empresa.com', '2019-07-12', 2150, 7),
('David Díaz', 'david.diaz@empresa.com', '2019-08-08', 2180, 8),
('Paula Sanz', 'paula.sanz@empresa.com', '2019-09-23', 1910, 9),
('Manuel Navarro', 'manuel.navarro@empresa.com', '2019-10-01', 1920, 10),
('Cristina Vera', 'cristina.vera@empresa.com', '2019-11-20', 1970, 11),
('Ismael Sánchez', 'ismael.sanchez@empresa.com', '2019-12-11', 2020, 12),
('Elena Prieto', 'elena.prieto@empresa.com', '2020-01-19', 2075, 13),
('Raúl Medina', 'raul.medina@empresa.com', '2020-02-22', 2065, 14),
('Julia Blanco', 'julia.blanco@empresa.com', '2020-03-10', 2125, 15),
('Andrés Gómez', 'andres.gomez@empresa.com', '2020-04-16', 1970, 16),
('Sergio Mora', 'sergio.mora@empresa.com', '2020-05-01', 1930, 17),
('Noelia León', 'noelia.leon@empresa.com', '2020-05-18', 1960, 18),
('Diego Torres', 'diego.torres@empresa.com', '2020-06-21', 2140, 19),
('Marina Ruiz', 'marina.ruiz@empresa.com', '2020-07-08', 1990, 20);

INSERT INTO proyectos (nombre, fecha_inicio, fecha_fin, presupuesto, id_departamento) VALUES
('Proyecto Innovación', '2022-01-10', '2022-05-10', 35000, 1),
('Marketing 360', '2022-02-11', '2022-06-15', 29000, 2),
('ERP Corporativo', '2022-03-21', '2022-08-20', 48000, 3),
('Campaña Verano', '2022-04-10', '2022-09-10', 21000, 4),
('LegalApp', '2022-05-05', '2022-10-30', 12000, 5),
('Logística Plus', '2022-06-15', '2022-11-22', 17500, 6),
('Control Financiero', '2022-07-12', '2022-12-20', 30000, 7),
('Sistema Compras', '2022-08-08', '2023-01-05', 18500, 8),
('Portal RRHH', '2022-09-23', '2023-02-10', 22500, 9),
('Operaciones Global', '2022-10-01', '2023-03-18', 27000, 10),
('Innovación IA', '2022-11-20', '2023-04-15', 34000, 11),
('Soporte 24x7', '2022-12-11', '2023-05-25', 32000, 12),
('Producción Smart', '2023-01-19', '2023-06-30', 44000, 13),
('Plan Expansión', '2023-02-22', '2023-07-15', 21000, 14),
('Control Calidad', '2023-03-10', '2023-08-20', 18000, 15),
('Gestión Proyectos', '2023-04-16', '2023-09-05', 27000, 16),
('App Control', '2023-05-01', '2023-10-13', 13500, 17),
('Infraestructura TI', '2023-05-18', '2023-11-01', 39000, 18),
('Auditoría Interna', '2023-06-21', '2023-12-12', 20000, 19),
('Mantenimiento 2.0', '2023-07-08', '2024-01-08', 22000, 20);

INSERT INTO asignaciones (id_empleado, id_proyecto, fecha_asignacion, rol) VALUES
(1, 1, '2022-01-10', 'Jefe de Proyecto'),
(2, 2, '2022-02-12', 'Analista'),
(3, 3, '2022-03-23', 'Técnico'),
(4, 4, '2022-04-15', 'Desarrollador'),
(5, 5, '2022-05-07', 'Gestor'),
(6, 6, '2022-06-16', 'Abogado'),
(7, 7, '2022-07-13', 'Logística'),
(8, 8, '2022-08-09', 'Compras'),
(9, 9, '2022-09-25', 'RRHH'),
(10, 10, '2022-10-05', 'Operaciones'),
(11, 11, '2022-11-22', 'Innovación'),
(12, 12, '2022-12-13', 'Soporte'),
(13, 13, '2023-01-20', 'Producción'),
(14, 14, '2023-02-24', 'Expansión'),
(15, 15, '2023-03-12', 'Calidad'),
(16, 16, '2023-04-18', 'Proyectos'),
(17, 17, '2023-05-03', 'Control'),
(18, 18, '2023-05-20', 'Infraestructura'),
(19, 19, '2023-06-22', 'Auditoría'),
(20, 20, '2023-07-09', 'Mantenimiento');

INSERT INTO clientes (nombre, email, telefono, pais) VALUES
('Antonio Gómez', 'antonio.gomez@mail.com', '+34 611234567', 'España'),
('María Pérez', 'maria.perez@mail.com', '+34 622345678', 'España'),
('Juan Rodríguez', 'juan.rodriguez@mail.com', '+34 633456789', 'México'),
('Patricia Sánchez', 'patricia.sanchez@mail.com', '+34 644567890', 'España'),
('Luisa Ramos', 'luisa.ramos@mail.com', '+34 655678901', 'Argentina'),
('Carlos Torres', 'carlos.torres@mail.com', '+34 666789012', 'Colombia'),
('Elena Morales', 'elena.morales@mail.com', '+34 677890123', 'Chile'),
('Miguel Herrera', 'miguel.herrera@mail.com', '+34 688901234', 'Perú'),
('Pilar Cano', 'pilar.cano@mail.com', '+34 699012345', 'España'),
('Fernando Gil', 'fernando.gil@mail.com', '+34 610123456', 'Uruguay'),
('Andrea Castro', 'andrea.castro@mail.com', '+34 621234567', 'España'),
('Raúl Moreno', 'raul.moreno@mail.com', '+34 632345678', 'España'),
('Diana Peña', 'diana.pena@mail.com', '+34 643456789', 'Venezuela'),
('Alberto Serrano', 'alberto.serrano@mail.com', '+34 654567890', 'España'),
('Carmen Ramos', 'carmen.ramos@mail.com', '+34 665678901', 'España'),
('Jorge Molina', 'jorge.molina@mail.com', '+34 676789012', 'Chile'),
('Sara Ortega', 'sara.ortega@mail.com', '+34 687890123', 'Colombia'),
('Francisco Ruiz', 'francisco.ruiz@mail.com', '+34 698901234', 'México'),
('Lucía Vidal', 'lucia.vidal@mail.com', '+34 609012345', 'España'),
('Roberto Marín', 'roberto.marin@mail.com', '+34 610987654', 'España');

INSERT INTO productos (nombre, categoria, precio, stock) VALUES
('Portátil UltraBook', 'Informática', 920.99, 14),
('Smartphone X50', 'Electrónica', 499.00, 37),
('Teclado Mecánico', 'Informática', 79.99, 58),
('Monitor 27\" FullHD', 'Informática', 175.99, 21),
('Ratón Inalámbrico', 'Informática', 34.95, 43),
('Auriculares Pro', 'Audio', 129.99, 36),
('Altavoz Bluetooth', 'Audio', 59.90, 27),
('Smartwatch Fit', 'Wearables', 169.00, 22),
('Tablet Pro 10', 'Informática', 349.99, 17),
('Cámara Web HD', 'Informática', 69.95, 46),
('SSD 1TB', 'Almacenamiento', 119.99, 25),
('Disco Duro Externo 2TB', 'Almacenamiento', 88.50, 19),
('Impresora Láser', 'Informática', 159.90, 31),
('Router WiFi6', 'Redes', 104.95, 28),
('Regleta Inteligente', 'Electrónica', 26.50, 39),
('Lámpara LED', 'Hogar', 19.90, 47),
('Powerbank 20000mAh', 'Electrónica', 39.90, 18),
('Tarjeta Gráfica X', 'Informática', 629.00, 11),
('Placa Base Gaming', 'Informática', 149.99, 20),
('Silla Ergonómica', 'Oficina', 189.90, 15);

INSERT INTO ventas (id_cliente, id_producto, cantidad, fecha, importe_total) VALUES
(1, 1, 1, '2024-01-10', 920.99),
(2, 2, 2, '2024-01-12', 998.00),
(3, 3, 3, '2024-01-15', 239.97),
(4, 4, 1, '2024-01-20', 175.99),
(5, 5, 2, '2024-01-21', 69.90),
(6, 6, 1, '2024-01-25', 129.99),
(7, 7, 2, '2024-01-28', 119.80),
(8, 8, 1, '2024-02-01', 169.00),
(9, 9, 1, '2024-02-04', 349.99),
(10, 10, 3, '2024-02-07', 209.85),
(11, 11, 2, '2024-02-09', 239.98),
(12, 12, 1, '2024-02-12', 159.90),
(13, 13, 1, '2024-02-15', 104.95),
(14, 14, 1, '2024-02-18', 26.50),
(15, 15, 2, '2024-02-20', 39.80),
(16, 16, 2, '2024-02-23', 79.80),
(17, 17, 1, '2024-02-25', 119.99),
(18, 18, 2, '2024-02-28', 239.98),
(19, 19, 1, '2024-03-02', 159.90),
(20, 20, 1, '2024-03-05', 104.95);