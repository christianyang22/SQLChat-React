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
('Mantenimiento', 60000),
('Consultoría', 71000),
('Atención al Cliente', 39000),
('Prevención', 43000),
('Sistemas', 80000),
('Desarrollo', 77000),
('Análisis', 69000),
('Documentación', 35000),
('Servicios Generales', 36000),
('Comunicación', 41000),
('I+D', 83000),
('Almacén', 38000),
('Logística Internacional', 54000),
('Gestión', 45000),
('Supervisión', 52000),
('Planificación', 50000),
('Redes', 68000),
('Formación', 37000),
('Sostenibilidad', 47000),
('Responsabilidad Social', 43000),
('Becas', 35000),
('Ingeniería', 92000),
('Data', 89000),
('Digitalización', 88000),
('Experiencia Cliente', 79000),
('Estrategia', 84000),
('Tecnología', 93000),
('Seguridad', 82000),
('Ciberseguridad', 94000),
('Compliance', 90000),
('Salud Laboral', 76000);

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
('Marina Ruiz', 'marina.ruiz@empresa.com', '2020-07-08', 1990, 20),
('Juan Peña', 'juan.pena@empresa.com', '2020-08-03', 2040, 21),
('Eva Ramos', 'eva.ramos@empresa.com', '2020-08-30', 2110, 22),
('Hugo Martín', 'hugo.martin@empresa.com', '2020-09-15', 2160, 23),
('Lucía Ortiz', 'lucia.ortiz@empresa.com', '2020-10-20', 2155, 24),
('Iván Ríos', 'ivan.rios@empresa.com', '2020-11-13', 1985, 25),
('María Vargas', 'maria.vargas@empresa.com', '2020-12-05', 2090, 26),
('Jorge Cano', 'jorge.cano@empresa.com', '2021-01-17', 2000, 27),
('Patricia Soto', 'patricia.soto@empresa.com', '2021-02-09', 2075, 28),
('Samuel Bravo', 'samuel.bravo@empresa.com', '2021-03-06', 2105, 29),
('Teresa Ramos', 'teresa.ramos@empresa.com', '2021-04-15', 1955, 30),
('Marc Vidal', 'marc.vidal@empresa.com', '2021-05-02', 2020, 31),
('Natalia Iglesias', 'natalia.iglesias@empresa.com', '2021-05-18', 1960, 32),
('Alberto Molina', 'alberto.molina@empresa.com', '2021-06-25', 2055, 33),
('Rocío Campos', 'rocio.campos@empresa.com', '2021-07-10', 2030, 34),
('Pablo Marín', 'pablo.marin@empresa.com', '2021-08-14', 1975, 35),
('Inés Ruiz', 'ines.ruiz@empresa.com', '2021-09-01', 1940, 36),
('Gonzalo Alonso', 'gonzalo.alonso@empresa.com', '2021-09-30', 2080, 37),
('Silvia Aguado', 'silvia.aguado@empresa.com', '2021-10-22', 2110, 38),
('Rubén Lozano', 'ruben.lozano@empresa.com', '2021-11-13', 2145, 39),
('Claudia Soler', 'claudia.soler@empresa.com', '2021-12-05', 2160, 40),
('Víctor Romero', 'victor.romero@empresa.com', '2022-01-17', 2005, 41),
('Celia Barrios', 'celia.barrios@empresa.com', '2022-02-09', 2070, 42),
('Fernando Lara', 'fernando.lara@empresa.com', '2022-03-06', 2135, 43),
('Lourdes Gil', 'lourdes.gil@empresa.com', '2022-04-15', 1915, 44),
('Alejandro Pardo', 'alejandro.pardo@empresa.com', '2022-05-02', 2025, 45),
('Álvaro Parra', 'alvaro.parra@empresa.com', '2022-05-18', 1995, 46),
('Gemma Suárez', 'gemma.suarez@empresa.com', '2022-06-25', 2105, 47),
('Óscar Marquez', 'oscar.marquez@empresa.com', '2022-07-10', 2000, 48),
('Susana Vera', 'susana.vera@empresa.com', '2022-08-14', 2035, 49),
('Berta Núñez', 'berta.nunez@empresa.com', '2022-09-01', 1945, 50);