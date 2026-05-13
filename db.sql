-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ministore
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` text,
  `quantity` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (15,5,5,'iphone mini',399.00,'https://cdn.pixabay.com/photo/2017/04/03/15/52/mobile-phone-2198770_1280.png',3),(16,5,4,'phone1',232.00,'https://images.pexels.com/photos/248528/pexels-photo-248528.jpeg?cs=srgb&dl=pexels-pixabay-248528.jpg&fm=jpg',5),(28,10,6,'i phone 10 xr',599.00,'https://img.lovepik.com/element/40177/3459.png_1200.png',1),(29,11,9,'sumsung A24 e',233.00,'https://www.sammyfans.com/wp-content/uploads/2023/03/galaxy-a34-2.jpg',1);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text,
  `total` decimal(10,2) NOT NULL,
  `payment` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Processing',
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `items` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (8,11,'shaina kumari','9876543210','paradise home pg , phase 5 , shahi majra , mohali, chandigarh, Select Circle - 160059',850.00,'COD','Processing',NULL,'[{\"id\": 24, \"name\": \"sumaung ultra 23\", \"image\": \"https://tse4.mm.bing.net/th/id/OIP.3f3_hGruKgby9zuxf9V6nAHaFj?rs=1&pid=ImgDetMain&o=7&rm=3\", \"price\": \"850.00\", \"quantity\": 1, \"product_id\": 8}]'),(10,10,'Ankit .','9876543210','paradise home pg , phase 5 , shahi majra , mohali, chandigarh, Select Circle - 160059',619.00,'COD','Shipped','2026-04-04 11:20:40','[{\"id\": 26, \"name\": \"i phone 10 xr\", \"image\": \"https://img.lovepik.com/element/40177/3459.png_1200.png\", \"price\": \"599.00\", \"quantity\": 1, \"product_id\": 6}]'),(11,10,'Aman kumar','7807465416','bhallar khurd teh khundian teh thill, Khundian, Himachal Pradesh - 176055',100.00,'UPI','Processing','2026-04-04 16:16:28','[{\"id\": 27, \"name\": \"watches\", \"image\": \"https://static.vecteezy.com/system/resources/thumbnails/029/496/009/small_2x/timeless-image-monochrome-captures-the-essence-of-apple-watch-ai-generated-photo.jpg\", \"price\": \"100.00\", \"quantity\": 1, \"product_id\": 2}]'),(12,10,'Aman kumar','7807465416','bhallar khurd teh khundian teh thill, Khundian, Himachal Pradesh - 176055',619.00,'COD','Processing','2026-04-05 13:51:45','[{\"id\": 28, \"name\": \"i phone 10 xr\", \"image\": \"https://img.lovepik.com/element/40177/3459.png_1200.png\", \"price\": \"599.00\", \"quantity\": 1, \"product_id\": 6}]'),(13,11,'shaina devi','7807465416','bhallar khurd teh khundian teh thill, Khundian, Himachal Pradesh - 176055',253.00,'UPI','Processing','2026-04-05 15:09:20','[{\"name\": \"sumsung A24 e\", \"image\": \"https://www.sammyfans.com/wp-content/uploads/2023/03/galaxy-a34-2.jpg\", \"price\": \"233.00\", \"quantity\": 1, \"product_id\": 9}]');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `image` text,
  `type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'watches',100,'https://static.vecteezy.com/system/resources/thumbnails/029/496/009/small_2x/timeless-image-monochrome-captures-the-essence-of-apple-watch-ai-generated-photo.jpg','Watches'),(4,'phone1',232,'https://images.pexels.com/photos/248528/pexels-photo-248528.jpeg?cs=srgb&dl=pexels-pixabay-248528.jpg&fm=jpg','Phones'),(5,'iphone mini',399,'https://cdn.pixabay.com/photo/2017/04/03/15/52/mobile-phone-2198770_1280.png','Phones'),(6,'i phone 10 xr',599,'https://img.lovepik.com/element/40177/3459.png_1200.png','Phones'),(7,'i phone 16',899,'https://tse2.mm.bing.net/th/id/OIP.O9zPZKkx0RY-5T0ieF9bFwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3','Phones'),(8,'sumaung ultra 23',850,'https://tse4.mm.bing.net/th/id/OIP.3f3_hGruKgby9zuxf9V6nAHaFj?rs=1&pid=ImgDetMain&o=7&rm=3','Phones'),(9,'sumsung A24 e',233,'https://www.sammyfans.com/wp-content/uploads/2023/03/galaxy-a34-2.jpg','Phones'),(10,'watche titan',499,'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=wood-wristwatch-time-190819.jpg&fm=jpg','Watches'),(11,'mini watch',200,'https://tse1.mm.bing.net/th/id/OIP.Gr3XILNljoc1o27KGMKB0QHaFj?rs=1&pid=ImgDetMain&o=7&rm=3','Watches'),(12,'Apple watch',450,'https://m.media-amazon.com/images/I/71AcGKTe9+L._AC_SL1500_.jpg','Watches'),(13,'Boat watche',299,'https://pngimg.com/uploads/watches/watches_PNG9905.png','Watches');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `image` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (10,'kumar22102001ankit@gmail.com','$2b$12$Sb43wtjJALZm5HlDLHUk4.nZGssDWc0JXtz56Fl8Ecg9CZRHjinVG','Ankit','http://127.0.0.1:5000/static/uploads\\5.jpg'),(11,'shainachoudhary505@gmail.com','$2b$12$tL/tmadR6WXTe82g/q3yZ.I0ZVcSCpjvSmy77zl2IgQt9yy6XA.8y','Shaina','http://127.0.0.1:5000/static/uploads\\pictanu.jpeg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-05 21:08:01
