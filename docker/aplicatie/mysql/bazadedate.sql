-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8mb3 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `user_type` VARCHAR(45) NOT NULL,
  `nume` VARCHAR(45) NOT NULL,
  `prenume` VARCHAR(45) NOT NULL,
  `sessionToken` VARCHAR(255) NULL DEFAULT NULL,
  `user_password` VARCHAR(255) NOT NULL,
  `salt` VARCHAR(255) NOT NULL,
  `nr_telefon` VARCHAR(25) NOT NULL,
  `poza` MEDIUMBLOB NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `user_name_UNIQUE` (`user_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`cabinete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`cabinete` (
  `cabinet_id` INT NOT NULL AUTO_INCREMENT,
  `judet` VARCHAR(45) NULL DEFAULT NULL,
  `localitate` VARCHAR(45) NULL DEFAULT NULL,
  `adresa` VARCHAR(45) NOT NULL,
  `user_id` INT NOT NULL,
  `denumire_Cabinet` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`cabinet_id`, `user_id`),
  INDEX `fk_Cabinete_Users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_Cabinete_Users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`program_psihologi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`program_psihologi` (
  `program_id` INT NOT NULL AUTO_INCREMENT,
  `ziua_saptamanii` VARCHAR(45) NOT NULL,
  `ora_inceput` TIME NOT NULL,
  `ora_sfarsit` TIME NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`program_id`, `user_id`),
  INDEX `fk_program_psihologi_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_program_psihologi_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`programari`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`programari` (
  `data_programare` TIMESTAMP NOT NULL,
  `data_realizare` TIMESTAMP NULL DEFAULT NULL,
  `programare_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `aprobat` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`programare_id`, `user_id`),
  INDEX `fk_programari_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_programari_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 24
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`servicii`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`servicii` (
  `seriviciu_id` INT NOT NULL AUTO_INCREMENT,
  `denumire` VARCHAR(45) NULL DEFAULT NULL,
  `pret` DECIMAL(10,0) NOT NULL,
  `user_id` INT NOT NULL,
  `durata` INT NOT NULL,
  `descriere` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`seriviciu_id`, `user_id`),
  INDEX `fk_Servicii_Users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_Servicii_Users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`programari_servicii`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`programari_servicii` (
  `programare_id` INT NOT NULL,
  `seriviciu_id` INT NOT NULL,
  PRIMARY KEY (`programare_id`, `seriviciu_id`),
  INDEX `fk_Programari_has_Servicii_Servicii1_idx` (`seriviciu_id` ASC) VISIBLE,
  INDEX `fk_Programari_has_Servicii_Programari1_idx` (`programare_id` ASC) VISIBLE,
  CONSTRAINT `fk_Programari_has_Servicii_Programari1`
    FOREIGN KEY (`programare_id`)
    REFERENCES `mydb`.`programari` (`programare_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Programari_has_Servicii_Servicii1`
    FOREIGN KEY (`seriviciu_id`)
    REFERENCES `mydb`.`servicii` (`seriviciu_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`reviews` (
  `review_id` INT NOT NULL AUTO_INCREMENT,
  `rating` VARCHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (`review_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`ratings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`ratings` (
  `review_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`review_id`, `user_id`),
  INDEX `fk_Reviews_has_Users_Users1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_Reviews_has_Users_Reviews1_idx` (`review_id` ASC) VISIBLE,
  CONSTRAINT `fk_Reviews_has_Users_Reviews1`
    FOREIGN KEY (`review_id`)
    REFERENCES `mydb`.`reviews` (`review_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Reviews_has_Users_Users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`specializari`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`specializari` (
  `specializare_id` INT NOT NULL AUTO_INCREMENT,
  `cod_specializare` VARCHAR(45) NOT NULL,
  `grad_specializare` VARCHAR(45) NULL DEFAULT NULL,
  `denumire_specializare` TINYTEXT NOT NULL,
  `poza_diploma` MEDIUMBLOB NULL DEFAULT NULL,
  `nr_atestat` VARCHAR(45) NOT NULL,
  `user_id` INT NOT NULL,
  `verificat` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`specializare_id`, `user_id`),
  UNIQUE INDEX `nr_atestat_UNIQUE` (`nr_atestat` ASC) VISIBLE,
  INDEX `fk_Specializari_Users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_Specializari_Users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`subscriptions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`subscriptions` (
  `subscription_id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(45) NOT NULL DEFAULT 'inactive',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`subscription_id`, `user_id`),
  INDEX `fk_subscriptions_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_subscriptions_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
