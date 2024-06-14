-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-06-2024 a las 21:07:30
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `minitaprueba`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerarInformeMensualPrestamos` (IN `p_mes` INT, IN `p_anio` INT)   BEGIN
    SELECT p.idPrestamo, p.fechaPrestamo, p.idTrabajador, p.idBodeguero, p.cantidadEquipos, p.fechaDevolucionEstimada
    FROM Prestamo p
    WHERE MONTH(p.fechaPrestamo) = p_mes AND YEAR(p.fechaPrestamo) = p_anio;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerarResumenEquiposDisponibles` ()   BEGIN
    SELECT e.idEquipo, e.nombre, e.descripcion, e.caracteristicasTecnicas, e.ubicacionBodega, e.estado
    FROM Equipo e
    WHERE e.estado = 'Disponible';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarDevolucion` (IN `p_fechaDevolucion` DATE, IN `p_estadoEquipo` VARCHAR(50), IN `p_observaciones` TEXT, IN `p_idPrestamo` INT)   BEGIN
    IF (SELECT COUNT(*) FROM Prestamo WHERE idPrestamo = p_idPrestamo) > 0 THEN
        INSERT INTO Devolucion (fechaDevolucion, estadoEquipo, observaciones, idPrestamo)
        VALUES (p_fechaDevolucion, p_estadoEquipo, p_observaciones, p_idPrestamo);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El ID del préstamo no existe.';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarInforme` (IN `p_tipoInforme` VARCHAR(50), IN `p_fechaGeneracion` DATE, IN `p_contenido` TEXT, IN `p_idAdministrador` INT)   BEGIN
    INSERT INTO Informe (tipoInforme, fechaGeneracion, contenido, idAdministrador)
    VALUES (p_tipoInforme, p_fechaGeneracion, p_contenido, p_idAdministrador);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarPrestamo` (IN `p_fechaPrestamo` DATE, IN `p_idTrabajador` INT, IN `p_idBodeguero` INT, IN `p_cantidadEquipos` INT, IN `p_fechaDevolucionEstimada` DATE)   BEGIN
    DECLARE last_id INT;

    -- Verificar que las fechas de préstamo y devolución sean válidas
    IF FechasPrestamoValidas(p_fechaPrestamo, p_fechaDevolucionEstimada) THEN
        -- Insertar en la tabla Prestamo
        INSERT INTO Prestamo (fechaPrestamo, idTrabajador, idBodeguero, cantidadEquipos, fechaDevolucionEstimada)
        VALUES (p_fechaPrestamo, p_idTrabajador, p_idBodeguero, p_cantidadEquipos, p_fechaDevolucionEstimada);
        
        -- Obtener el último idPrestamo insertado
        SET last_id = LAST_INSERT_ID();

        -- Insertar en la tabla PrestamoEquipo
        INSERT INTO PrestamoEquipo (idPrestamo, idEquipo)
        SELECT last_id, idEquipo FROM TempPrestamoEquipos;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La fecha de devolución debe ser posterior a la fecha de préstamo.';
    END IF;
END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `CantidadEquiposPrestadosPorAdministrador` (`idAdministrador` INT) RETURNS INT(11)  BEGIN
    DECLARE cantidad INT;
    SELECT COUNT(*) INTO cantidad
    FROM Prestamo p
    JOIN Administrador a ON p.idBodeguero = a.idAdministrador
    WHERE a.idAdministrador = idAdministrador;
    RETURN cantidad;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `CantidadEquiposPrestadosPorBodeguero` (`idBodeguero` INT) RETURNS INT(11)  BEGIN
    DECLARE cantidad INT;
    SELECT COUNT(*) INTO cantidad
    FROM PrestamoEquipo pe
    JOIN Prestamo p ON pe.idPrestamo = p.idPrestamo
    WHERE p.idBodeguero = idBodeguero;
    RETURN cantidad;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `CantidadEquiposPrestadosPorTrabajador` (`idTrabajador` INT) RETURNS INT(11)  BEGIN
    DECLARE cantidad INT;
    SELECT COUNT(*) INTO cantidad
    FROM PrestamoEquipo pe
    JOIN Prestamo p ON pe.idPrestamo = p.idPrestamo
    WHERE p.idTrabajador = idTrabajador;
    RETURN cantidad;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `FechasPrestamoValidas` (`fechaPrestamo` DATE, `fechaDevolucion` DATE) RETURNS TINYINT(1)  BEGIN
    RETURN fechaDevolucion > fechaPrestamo;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `idAdministrador` int(11) NOT NULL,
  `idUsuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`idAdministrador`, `idUsuario`) VALUES
(1, 1);

--
-- Disparadores `administrador`
--
DELIMITER $$
CREATE TRIGGER `before_insert_administrador` BEFORE INSERT ON `administrador` FOR EACH ROW BEGIN
    IF (SELECT COUNT(*) FROM Bodeguero WHERE idUsuario = NEW.idUsuario) > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario ya está registrado como Bodeguero.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bodeguero`
--

CREATE TABLE `bodeguero` (
  `idBodeguero` int(11) NOT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `ubicacionBodega` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bodeguero`
--

INSERT INTO `bodeguero` (`idBodeguero`, `idUsuario`, `ubicacionBodega`) VALUES
(2, 2, 'Bodega Central');

--
-- Disparadores `bodeguero`
--
DELIMITER $$
CREATE TRIGGER `before_insert_bodeguero` BEFORE INSERT ON `bodeguero` FOR EACH ROW BEGIN
    IF (SELECT COUNT(*) FROM Administrador WHERE idUsuario = NEW.idUsuario) > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario ya está registrado como Administrador.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devolucion`
--

CREATE TABLE `devolucion` (
  `idDevolucion` int(11) NOT NULL,
  `fechaDevolucion` date DEFAULT NULL,
  `estadoEquipo` varchar(50) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `idPrestamo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `devolucion`
--

INSERT INTO `devolucion` (`idDevolucion`, `fechaDevolucion`, `estadoEquipo`, `observaciones`, `idPrestamo`) VALUES
(1, '2024-06-10', 'Bueno', 'Sin observaciones', 1),
(2, '2024-06-08', 'Bueno', 'Ninguna', 2);

--
-- Disparadores `devolucion`
--
DELIMITER $$
CREATE TRIGGER `after_insert_devolucion` AFTER INSERT ON `devolucion` FOR EACH ROW BEGIN
    INSERT INTO LogCambios (tabla, idRegistro, operacion, fecha)
    VALUES ('Devolucion', NEW.idDevolucion, 'INSERT', NOW());
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_devolucion_equipo` AFTER INSERT ON `devolucion` FOR EACH ROW BEGIN
    UPDATE Equipo
    SET estado = 'Disponible'
    WHERE idEquipo = (SELECT idEquipo FROM PrestamoEquipo WHERE idPrestamo = NEW.idPrestamo);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_update_devolucion` AFTER UPDATE ON `devolucion` FOR EACH ROW BEGIN
    INSERT INTO LogCambios (tabla, idRegistro, operacion, fecha)
    VALUES ('Devolucion', NEW.idDevolucion, 'UPDATE', NOW());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo`
--

CREATE TABLE `equipo` (
  `idEquipo` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `caracteristicasTecnicas` text DEFAULT NULL,
  `ubicacionBodega` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipo`
--

INSERT INTO `equipo` (`idEquipo`, `nombre`, `descripcion`, `caracteristicasTecnicas`, `ubicacionBodega`, `estado`) VALUES
(1, 'Laptop', 'Laptop Dell Inspiron', 'Intel i7, 16GB RAM, 512GB SSD', 'Bodega Central', 'Prestado'),
(2, 'Proyector', 'Proyector Epson', '3000 lumens', 'Bodega Norte', 'Prestado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `informe`
--

CREATE TABLE `informe` (
  `idInforme` int(11) NOT NULL,
  `tipoInforme` varchar(50) DEFAULT NULL,
  `fechaGeneracion` date DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  `idAdministrador` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `informe`
--

INSERT INTO `informe` (`idInforme`, `tipoInforme`, `fechaGeneracion`, `contenido`, `idAdministrador`) VALUES
(1, 'StockEquipos', '2024-06-05', 'Informe detallado de stock de equipos.', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logcambios`
--

CREATE TABLE `logcambios` (
  `idLog` int(11) NOT NULL,
  `tabla` varchar(50) DEFAULT NULL,
  `idRegistro` int(11) DEFAULT NULL,
  `operacion` varchar(10) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `logcambios`
--

INSERT INTO `logcambios` (`idLog`, `tabla`, `idRegistro`, `operacion`, `fecha`) VALUES
(1, 'Prestamo', 2, 'INSERT', '2024-06-06 21:17:51'),
(2, 'Devolucion', 2, 'INSERT', '2024-06-09 18:12:48'),
(3, 'Prestamo', 3, 'INSERT', '2024-06-11 10:56:51'),
(4, 'Prestamo', 4, 'INSERT', '2024-06-11 10:56:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamo`
--

CREATE TABLE `prestamo` (
  `idPrestamo` int(11) NOT NULL,
  `fechaPrestamo` date DEFAULT NULL,
  `idTrabajador` int(11) DEFAULT NULL,
  `idBodeguero` int(11) DEFAULT NULL,
  `cantidadEquipos` int(11) DEFAULT NULL,
  `fechaDevolucionEstimada` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prestamo`
--

INSERT INTO `prestamo` (`idPrestamo`, `fechaPrestamo`, `idTrabajador`, `idBodeguero`, `cantidadEquipos`, `fechaDevolucionEstimada`) VALUES
(1, '2024-06-01', 1, 2, 1, '2024-06-10'),
(2, '2024-06-05', 2, 2, 1, '2024-06-10'),
(3, '2024-06-11', 1, 2, 2, '2024-06-15');

--
-- Disparadores `prestamo`
--
DELIMITER $$
CREATE TRIGGER `after_insert_prestamo` AFTER INSERT ON `prestamo` FOR EACH ROW BEGIN
    INSERT INTO LogCambios (tabla, idRegistro, operacion, fecha)
    VALUES ('Prestamo', NEW.idPrestamo, 'INSERT', NOW());
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_update_prestamo` AFTER UPDATE ON `prestamo` FOR EACH ROW BEGIN
    INSERT INTO LogCambios (tabla, idRegistro, operacion, fecha)
    VALUES ('Prestamo', NEW.idPrestamo, 'UPDATE', NOW());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamoequipo`
--

CREATE TABLE `prestamoequipo` (
  `idPrestamo` int(11) NOT NULL,
  `idEquipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prestamoequipo`
--

INSERT INTO `prestamoequipo` (`idPrestamo`, `idEquipo`) VALUES
(1, 1),
(2, 1),
(3, 1),
(3, 2);

--
-- Disparadores `prestamoequipo`
--
DELIMITER $$
CREATE TRIGGER `after_insert_prestamo_equipo` AFTER INSERT ON `prestamoequipo` FOR EACH ROW BEGIN
    UPDATE Equipo
    SET estado = 'Prestado'
    WHERE idEquipo = NEW.idEquipo;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajador`
--

CREATE TABLE `trabajador` (
  `idTrabajador` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `cargo` varchar(50) DEFAULT NULL,
  `departamento` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `trabajador`
--

INSERT INTO `trabajador` (`idTrabajador`, `nombre`, `apellido`, `cargo`, `departamento`) VALUES
(1, 'Carlos', 'Gomez', 'Ingeniero', 'TI'),
(2, 'Ana', 'Rodriguez', 'Administrativo', 'RRHH');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `contraseña` varchar(50) DEFAULT NULL,
  `cargo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `nombre`, `apellido`, `contraseña`, `cargo`) VALUES
(1, 'admin', 'admin', 'password', 'Administrador'),
(2, 'juan', 'perez', 'password', 'Bodeguero');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `usuariosroles`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `usuariosroles` (
`idUsuario` int(11)
,`rol` varchar(13)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `usuariosroles`
--
DROP TABLE IF EXISTS `usuariosroles`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `usuariosroles`  AS SELECT `administrador`.`idUsuario` AS `idUsuario`, 'Administrador' AS `rol` FROM `administrador`union select `bodeguero`.`idUsuario` AS `idUsuario`,'Bodeguero' AS `rol` from `bodeguero`  ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`idAdministrador`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `bodeguero`
--
ALTER TABLE `bodeguero`
  ADD PRIMARY KEY (`idBodeguero`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD PRIMARY KEY (`idDevolucion`),
  ADD KEY `idPrestamo` (`idPrestamo`);

--
-- Indices de la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD PRIMARY KEY (`idEquipo`);

--
-- Indices de la tabla `informe`
--
ALTER TABLE `informe`
  ADD PRIMARY KEY (`idInforme`),
  ADD KEY `idAdministrador` (`idAdministrador`);

--
-- Indices de la tabla `logcambios`
--
ALTER TABLE `logcambios`
  ADD PRIMARY KEY (`idLog`);

--
-- Indices de la tabla `prestamo`
--
ALTER TABLE `prestamo`
  ADD PRIMARY KEY (`idPrestamo`),
  ADD KEY `idTrabajador` (`idTrabajador`),
  ADD KEY `idBodeguero` (`idBodeguero`);

--
-- Indices de la tabla `prestamoequipo`
--
ALTER TABLE `prestamoequipo`
  ADD PRIMARY KEY (`idPrestamo`,`idEquipo`),
  ADD KEY `idEquipo` (`idEquipo`);

--
-- Indices de la tabla `trabajador`
--
ALTER TABLE `trabajador`
  ADD PRIMARY KEY (`idTrabajador`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  MODIFY `idDevolucion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `equipo`
--
ALTER TABLE `equipo`
  MODIFY `idEquipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `informe`
--
ALTER TABLE `informe`
  MODIFY `idInforme` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `logcambios`
--
ALTER TABLE `logcambios`
  MODIFY `idLog` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `prestamo`
--
ALTER TABLE `prestamo`
  MODIFY `idPrestamo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `trabajador`
--
ALTER TABLE `trabajador`
  MODIFY `idTrabajador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`);

--
-- Filtros para la tabla `bodeguero`
--
ALTER TABLE `bodeguero`
  ADD CONSTRAINT `bodeguero_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`);

--
-- Filtros para la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD CONSTRAINT `devolucion_ibfk_1` FOREIGN KEY (`idPrestamo`) REFERENCES `prestamo` (`idPrestamo`);

--
-- Filtros para la tabla `informe`
--
ALTER TABLE `informe`
  ADD CONSTRAINT `informe_ibfk_1` FOREIGN KEY (`idAdministrador`) REFERENCES `administrador` (`idAdministrador`);

--
-- Filtros para la tabla `prestamo`
--
ALTER TABLE `prestamo`
  ADD CONSTRAINT `prestamo_ibfk_1` FOREIGN KEY (`idTrabajador`) REFERENCES `trabajador` (`idTrabajador`),
  ADD CONSTRAINT `prestamo_ibfk_2` FOREIGN KEY (`idBodeguero`) REFERENCES `bodeguero` (`idBodeguero`);

--
-- Filtros para la tabla `prestamoequipo`
--
ALTER TABLE `prestamoequipo`
  ADD CONSTRAINT `prestamoequipo_ibfk_1` FOREIGN KEY (`idPrestamo`) REFERENCES `prestamo` (`idPrestamo`),
  ADD CONSTRAINT `prestamoequipo_ibfk_2` FOREIGN KEY (`idEquipo`) REFERENCES `equipo` (`idEquipo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
