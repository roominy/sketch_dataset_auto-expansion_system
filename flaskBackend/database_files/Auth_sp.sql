DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_validate_login`(
	IN p_username VARCHAR(45)
)
BEGIN
	IF ( SELECT EXISTS (SELECT 1 FROM USER WHERE username = p_username ) ) THEN
		SELECT id, username, first_name, last_name, email, role, password, status FROM USER WHERE username = p_username;
    ELSE 
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid username or password.', MYSQL_ERRNO = 1001;
	END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_register_user`( 
	IN p_first_name VARCHAR(45),
    IN p_last_name VARCHAR(45),
    IN p_username VARCHAR(45),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(60)
)
BEGIN

	IF ( SELECT EXISTS (SELECT 1 FROM USER WHERE username = p_username  ) ) THEN
     
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username exists.', MYSQL_ERRNO = 1001;
	
    ELSEIF ( SELECT EXISTS (SELECT 1 FROM USER WHERE email = p_email) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email is linked to another account.', MYSQL_ERRNO = 1001;
    
    ELSE
     
        INSERT INTO USER
        (
            first_name,
            last_name,
            username,
            email,
            password,
            role,
            user_created,
            user_modified
            
        )
        values
        (
            p_first_name,
            p_last_name,
            p_username,
            p_email,
            p_password,
            'user',
            p_username,
            p_username
        );
     
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_verify_email`( 
	IN p_email VARCHAR(255)
)
BEGIN

	DECLARE existing_username VARCHAR(45);
    DECLARE ID INT;
    
    SELECT username INTO existing_username FROM USER WHERE email = p_email;

    IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE email = p_email ) ) THEN
    
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not exist.', MYSQL_ERRNO = 1001;
        
	ELSEIF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE email = p_email AND status = 'pending' ) ) THEN
    
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already verified', MYSQL_ERRNO = 1001;
        
    ELSE
        -- Perform the update
        UPDATE USER
        SET 
            status =  'active',
            user_modified = existing_username
        WHERE email = p_email;
        
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_validate_user`(
	IN p_username VARCHAR(45)
)
BEGIN
	IF ( SELECT EXISTS (SELECT 1 FROM USER WHERE username = p_username ) ) THEN
		SELECT id, username, email, role, status FROM USER WHERE username = p_username;
    ELSE 
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid User.', MYSQL_ERRNO = 1001;
	END IF;

END$$
DELIMITER ;
