DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_fetch_users`(
	IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and  role = 'admin'  ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
	
    ELSE
    
		SELECT 
			id, 
			username, 
			first_name, 
			last_name, 
			email, 
			status, 
			role 
        FROM USER
        ORDER BY status, first_name, last_name; 
    
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_create_user`(
     IN p_first_name VARCHAR(45),
    IN p_last_name VARCHAR(45),
    IN p_username VARCHAR(45),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(60),
    IN p_role ENUM('user', 'admin', 'data_admin'),
    IN p_user_modified VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_user_modified AND role = 'admin' ) ) THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.' , MYSQL_ERRNO = 1001;
        
    ELSEIF ( SELECT EXISTS (SELECT 1 FROM USER WHERE username = p_username  ) ) THEN
     
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
            p_role,
             p_user_modified,
            p_user_modified
        );
     
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_update_user`(
    IN p_id INT,
    IN p_first_name VARCHAR(45),
    IN p_last_name VARCHAR(45),
    IN p_username VARCHAR(45),
    IN p_email VARCHAR(255),
    IN p_role ENUM('user', 'admin', 'data_admin'),
    IN p_user_modified VARCHAR(45),
    OUT p_email_updated INT
)
BEGIN
    DECLARE existing_email VARCHAR(255);
    DECLARE existing_status ENUM('active', 'pending', 'inactive');
    DECLARE is_admin TINYINT;
    DECLARE username_exists TINYINT;
    DECLARE email_exists TINYINT;

    -- Initially, set p_email_updated to 0 (meaning no update)
    SET p_email_updated = 0;

    -- Retrieve the current email and status of the user
    SELECT email, status INTO existing_email, existing_status FROM USER WHERE id = p_id LIMIT 1;

    -- Check if the modifying user is an admin
    SELECT EXISTS (SELECT 1 FROM USER WHERE username = p_user_modified AND role IN ('admin', 'data_admin')) INTO is_admin;

    -- Check for existing username and email
    SELECT EXISTS (SELECT 1 FROM USER WHERE username = p_username AND id != p_id) INTO username_exists;
    SELECT EXISTS (SELECT 1 FROM USER WHERE email = p_email AND id != p_id) INTO email_exists;

    -- Unauthorized user check
    IF is_admin = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
    END IF;

    -- Username exists check
    IF username_exists THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username exists.', MYSQL_ERRNO = 1002;
    END IF;

    -- Email exists check
    IF email_exists THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email is linked to another account.', MYSQL_ERRNO = 1003;
    END IF;

    -- Perform the update
    UPDATE USER
    SET 
        first_name = p_first_name,
        last_name = p_last_name,
        username = p_username,
        email = p_email,
        role = p_role,
        status = IF(p_email = existing_email, existing_status, 'pending'),
        user_modified = p_user_modified
    WHERE id = p_id;
    
    -- Check if the email was updated
    IF NOT p_email = existing_email THEN
        SET p_email_updated = 1; -- Email was updated
    END IF;
    SELECT p_email_updated FROM DUAL;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_reset_user_password`(
	IN p_username VARCHAR(45),
    IN p_password VARCHAR(60),
    IN p_user_modified VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_user_modified AND role = 'admin' ) ) THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.' , MYSQL_ERRNO = 1001;
        
    ELSEIF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username  ) ) THEN
     
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username does not exists.', MYSQL_ERRNO = 1001;
	
    ELSEIF ( SELECT EXISTS (SELECT 1 FROM USER WHERE username = p_username AND status = 'pending'  ) ) THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account email not verified', MYSQL_ERRNO = 1001;
    
    ELSE
    
		UPDATE USER
		SET 
			password = p_password,
            user_modified = p_user_modified
		WHERE username  = p_username ;
	END IF;
	
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_change_user_status`(
	IN p_id INT,
    IN p_username VARCHAR(45),
    IN p_user_modified VARCHAR(45)
    
)
BEGIN

	DECLARE existing_status ENUM('active', 'inactive', 'pending');
    
    SELECT status INTO existing_status FROM USER WHERE id = p_id;

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_user_modified AND role = 'admin' ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
	
     ELSEIF (SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username) )  THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid User.', MYSQL_ERRNO = 1001;
        
    ELSEIF (SELECT EXISTS (SELECT 1 FROM USER WHERE username = p_username AND (status = 'pending')) )  THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User status is pending.', MYSQL_ERRNO = 1001;
    
    ELSE
    
		UPDATE USER
		SET status = CASE existing_status 
            WHEN 'active' THEN 'inactive'
            WHEN 'inactive' THEN 'active'
            END, 
            user_modified = p_user_modified
		WHERE id = p_id; 
    
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_fetch_profile`(
	IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
	
    ELSE
    
		SELECT id, username, first_name, last_name, email, status, role 
        FROM USER 
        WHERE username = p_username ; 
    
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_update_profile`(
    IN p_id INT,
    IN p_first_name VARCHAR(45),
    IN p_last_name VARCHAR(45),
    IN p_username VARCHAR(45),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(60)
)
BEGIN
    DECLARE existing_email VARCHAR(255);
    DECLARE p_email_updated INT;
	DECLARE existing_password  VARCHAR(60);
    DECLARE existing_status ENUM('active', 'pending', 'inactive');

    -- Initially, set p_email_updated to 0 (meaning no update)
    SET p_email_updated = 0;

    -- Retrieve the current email of the user
    SELECT email INTO existing_email FROM USER WHERE id = p_id;
    SELECT password INTO existing_password FROM USER WHERE username = p_username;
	SELECT status INTO existing_status FROM USER WHERE username = p_username;
    
	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username)) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
    
    ELSEIF ( SELECT EXISTS (SELECT 1 FROM USER WHERE username = p_username AND id != p_id) ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username exists.', MYSQL_ERRNO = 1001;
    
    ELSEIF ( SELECT EXISTS (SELECT 1 FROM USER WHERE email = p_email AND id != p_id) ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email is linked to another account.', MYSQL_ERRNO = 1001;
    
    ELSE
        -- Perform the update
        UPDATE USER
        SET 
            first_name = p_first_name,
            last_name = p_last_name,
            email = p_email,
            password = CASE 
                           WHEN p_password = '' THEN existing_password
                           ELSE p_password
                       END,
			status = CASE
						   WHEN p_email = existing_email THEN existing_status
                           ELSE 'pending'
					 END,
            user_modified = p_username
        WHERE id = p_id;
        
        -- Check if the email was updated
        IF NOT p_email = existing_email THEN
            SET p_email_updated = 1; -- Email was updated
        END IF;
        
        SELECT p_email_updated FROM DUAL;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_deactivate_profile`(
	IN p_id INT,
    IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
	
    ELSEIF (SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username AND status = 'active') )  THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Profile can not be activated.', MYSQL_ERRNO = 1001;
    
    ELSE
    
		UPDATE USER
		SET status =  'inactive',
            user_modified = p_username
		WHERE id = p_id; 
    
    END IF;

END$$
DELIMITER ;
