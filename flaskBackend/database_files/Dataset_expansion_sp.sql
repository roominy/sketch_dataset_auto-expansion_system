DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_create_category`(
	IN p_category_name VARCHAR(45),
    IN p_category_label VARCHAR(45),
    IN p_description VARCHAR(250),
    IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
    
    ELSEIF ( SELECT EXISTS (SELECT 1 FROM CATEGORY WHERE category_name = p_category_name) )  THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category name already exists.', MYSQL_ERRNO = 1001;
    
    ELSE
     
        INSERT INTO CATEGORY
        (
            category_name,
            category_label,
            description,
            user_created,
            user_modified
        )
        values
        (
			p_category_name,
            p_category_label,
            p_description,
            p_username,
            p_username
        );
     
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_update_category`(
	IN p_category_id INT,
    IN p_category_name VARCHAR(45),
    IN p_category_label VARCHAR(45),
    IN p_description VARCHAR(250),
    IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
    
    ELSEIF ( SELECT EXISTS (SELECT 1 FROM CATEGORY WHERE category_name = p_category_name AND NOT( category_id = p_category_id )  ) )  THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category name already exists.', MYSQL_ERRNO = 1001;
	
    ELSEIF (SELECT NOT EXISTS (SELECT 1 FROM CATEGORY WHERE category_id = p_category_id) )  THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid category ID.', MYSQL_ERRNO = 1001;
    
    ELSE
    
		UPDATE CATEGORY
		SET category_label = p_category_label, 
			category_name = p_category_name,
			description = p_description,
            user_modified = p_username
		WHERE category_id = p_category_id; 
    
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_change_catagory_status`(
	IN p_category_id INT,
    IN p_status ENUM('active', 'inactive'),
    IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
	
    ELSEIF (SELECT NOT EXISTS (SELECT 1 FROM CATEGORY WHERE category_id = p_category_id) )  THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid category ID.', MYSQL_ERRNO = 1001;
    
    ELSE
    
		UPDATE CATEGORY
		SET status = CASE p_status 
            WHEN 'active' THEN 'inactive'
            WHEN 'inactive' THEN 'active'
            END, 
            user_modified = p_username
		WHERE category_id = p_category_id; 
    
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_fetch_categroies`(
	IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
	
    ELSE
    
		SELECT category_id,
			category_name,
			category_label,
			description,
			status 
        FROM CATEGORY
        ORDER BY status, category_name;
    
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_fetch_baselines_groups`(
	IN p_category_id INT,
	IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
    
    ELSEIF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE category_id = p_category_id) THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category does not exists.', MYSQL_ERRNO = 1001;
    
    ELSE
    
		SELECT 
			baseline_group_id,
            category_id,
            group_name,
            description 
        FROM BASELINE_GROUP
        WHERE category_id = p_category_id
        ORDER BY group_name;
    
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_create_baseline_group`(
	IN p_category_id INT,
    IN p_group_name VARCHAR(45),
    IN p_description VARCHAR(250),
    IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
	
    ELSEIF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE category_id = p_category_id) THEN
        
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category does not exist.', MYSQL_ERRNO = 1001;
    
    ELSEIF ( SELECT EXISTS (SELECT 1 FROM BASELINE_GROUP WHERE group_name = p_group_name AND category_id =  p_category_id) )  THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Baseline group name already exists for category.', MYSQL_ERRNO = 1001;
    
    ELSE
    
		INSERT INTO BASELINE_GROUP
        (
            category_id,
            group_name,
            description,
            user_created,
            user_modified
        )
        values
        (
			p_category_id,
            p_group_name,
            p_description,
            p_username,
            p_username
        );
     
    END IF;


END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_delete_baseline_group`(
	IN p_baseline_group_id INT,
	IN p_username VARCHAR(45)
    
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
	
	ELSEIF NOT EXISTS (SELECT 1 FROM BASELINE_GROUP WHERE baseline_group_id = p_baseline_group_id) THEN
        
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Baseline group does not exist.', MYSQL_ERRNO = 1001;
    
    ELSE
    
		-- Delete sketches associated with the baseline group
		DELETE FROM BASELINE_SKETCH WHERE baseline_group_id = p_baseline_group_id;

		-- Delete the baseline group
		DELETE FROM BASELINE_GROUP WHERE baseline_group_id = p_baseline_group_id;
    
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_fetch_baseline_sketches`(
	IN p_baseline_group_id INT,
    IN p_username VARCHAR(45)
)
BEGIN
	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
	
	ELSEIF NOT EXISTS (SELECT 1 FROM BASELINE_GROUP WHERE baseline_group_id = p_baseline_group_id) THEN
        
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Baseline group does not exist.', MYSQL_ERRNO = 1001;
    
    ELSE
		SELECT 
			baseline_id, baseline_name, CONCAT('data:image/', baseline_ext, ';base64,' , TO_BASE64(baseline_sketch)) as baseline_sketch
        FROM 
			BASELINE_SKETCH
        WHERE 
			baseline_group_id = p_baseline_group_id
		ORDER BY baseline_name;
	END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_create_baseline_sketch`(
	IN p_baseline_group_id INT,
    -- IN p_baseline_name VARCHAR(200),
	-- IN p_baseline_sketch BLOB,
    IN p_baseline_json JSON,
    IN p_username VARCHAR(45)
)
BEGIN

	DECLARE v_baseline_name VARCHAR(200);
    DECLARE v_baseline_sketch LONGBLOB;
    DECLARE v_counter INT DEFAULT 0;
    DECLARE v_total_items INT;

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
	
	ELSEIF NOT EXISTS (SELECT 1 FROM BASELINE_GROUP WHERE baseline_group_id = p_baseline_group_id) THEN
        
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Baseline group does not exist.', MYSQL_ERRNO = 1001;
    
    ELSE
    
		SET v_total_items = JSON_LENGTH(p_baseline_json);
        
        loop_label: LOOP
			IF v_counter >= v_total_items THEN
				LEAVE loop_label;
			END IF;
            
			SET v_baseline_name = JSON_UNQUOTE(JSON_EXTRACT(p_baseline_json, CONCAT('$[', v_counter, '].baseline_name')));
			SET v_baseline_sketch = FROM_BASE64(
                REPLACE(
                    JSON_UNQUOTE(JSON_EXTRACT(p_baseline_json, CONCAT('$[', v_counter, '].baseline_sketch'))),
                    'data:image/png;base64,', ''
                )
            );
            
            INSERT INTO BASELINE_SKETCH
            (
                baseline_group_id,
                baseline_name,
                baseline_sketch,
                user_created,
                user_modified
            )
            VALUES
            (
                p_baseline_group_id,
                v_baseline_name,
                v_baseline_sketch,
                p_username,
                p_username
            );
            SET v_counter = v_counter + 1;
		END LOOP;
        
     
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_delete_baseline_sketch`(
	IN p_baseline_id INT,
	IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
	
	ELSEIF NOT EXISTS (SELECT 1 FROM BASELINE_SKETCH WHERE baseline_id = p_baseline_id) THEN
        
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Baseline sketch does not exist.', MYSQL_ERRNO = 1001;
    
    ELSE
    
		-- Delete sketches associated with the baseline group
		DELETE FROM BASELINE_SKETCH WHERE baseline_id = p_baseline_id;
    
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_create_pipeline_configuration`(
    p_configuration_name VARCHAR(100),
    p_baseline_group_id INT,
    p_category_id INT,
    p_threshold FLOAT(3,2),
    p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
    
    ELSEIF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE category_id = p_category_id) THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category does not exists.', MYSQL_ERRNO = 1001;
        
    ELSEIF NOT EXISTS (SELECT 1 FROM BASELINE_GROUP WHERE baseline_group_id = p_baseline_group_id AND category_id = p_category_id) THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Baseline group does not exists.', MYSQL_ERRNO = 1001;
        
	ELSEIF NOT EXISTS (SELECT 1 FROM BASELINE_SKETCH WHERE baseline_group_id = p_baseline_group_id) THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Baseline group is empty', MYSQL_ERRNO = 1001;
    
    ELSEIF EXISTS ( SELECT 1 
						FROM PIPELINE_CONFIGURATION as PS 
								LEFT JOIN BASELINE_GROUP as BG on PS.baseline_group_id = BG.baseline_group_id 
						WHERE BG.category_id = p_category_id AND PS.configuration_name = p_configuration_name ) THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Duplicate pipeline configuration.', MYSQL_ERRNO = 1001;
    
    ELSE
    
		INSERT INTO PIPELINE_CONFIGURATION
		(
			baseline_group_id,
			configuration_name,  
			threshold,
			user_created,
			user_modified
		)
		VALUES
		(
            p_baseline_group_id,
			p_configuration_name,  
			p_threshold,
            p_username,
            p_username
		);
    
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_fetch_pipeline_configurations`(
    IN p_category_id INT,
	IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
    
    ELSEIF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE category_id = p_category_id) THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category does not exists.', MYSQL_ERRNO = 1001;
        
    ELSE
    
		SELECT 
			PS.configuration_id,
			PS.configuration_name,
			BG.baseline_group_id, 
			BG.group_name as baseline_group_name,
			PS.threshold,
			PS.status 
		FROM 
			PIPELINE_CONFIGURATION as PS 
			LEFT JOIN BASELINE_GROUP as BG on PS.baseline_group_id = BG.baseline_group_id 
		WHERE BG.category_id = p_category_id
        ORDER BY PS.status, PS.configuration_name ;
        
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_change_pipeline_configuration_status`(
	IN p_configuration_id INT,
    IN p_category_id INT,
	IN p_username VARCHAR(45)
)
BEGIN

	DECLARE existing_status ENUM('active', 'inactive');
    
	SELECT status INTO existing_status FROM PIPELINE_CONFIGURATION WHERE configuration_id = p_configuration_id;
    
    IF existing_status = 'active' THEN
        SET existing_status = 'inactive';
    ELSEIF existing_status = 'inactive' THEN
        SET existing_status = 'active';
    END IF;

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
    
    ELSEIF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE category_id = p_category_id) THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category does not exists.', MYSQL_ERRNO = 1001;
        
    ELSEIF NOT EXISTS ( SELECT 1 
						FROM 
							PIPELINE_CONFIGURATION as PS 
							LEFT JOIN BASELINE_GROUP as BG on PS.baseline_group_id = BG.baseline_group_id 
						WHERE BG.category_id = p_category_id AND PS.configuration_id = p_configuration_id)  THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Pipeline configuration does not exists.', MYSQL_ERRNO = 1001;
    
    ELSE
            
		UPDATE PIPELINE_CONFIGURATION as PS
        LEFT JOIN BASELINE_GROUP AS BG ON PS.baseline_group_id = BG.baseline_group_id
			SET status = CASE 
				WHEN configuration_id = p_configuration_id THEN existing_status
				ELSE 'inactive'
			END
		WHERE BG.category_id = p_category_id;
								
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_fetch_pipeline_result`(
	IN p_configuration_id INT,
	IN p_username VARCHAR(45)
)
BEGIN

	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username = p_username and (role = "data_admin" or role = "admin" ) ) )  THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.', MYSQL_ERRNO = 1001;
    
    ELSEIF NOT EXISTS (SELECT 1 FROM PIPELINE_CONFIGURATION WHERE configuration_id = p_configuration_id) THEN
		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Pipeline configuration does not exists.', MYSQL_ERRNO = 1001;
    
    ELSE
    
		SELECT  
			PR.result_id, 
            CONCAT(PS.configuration_name, '_', PR.result_id, '_', PR.sketch_id,'.png') AS sketch_name,
			PR.result,
            CONCAT('data:image/png;base64,' , TO_BASE64(S.sketch_image)) AS sketch
        FROM  PIPELINE_RESULTS AS PR
        INNER JOIN PIPELINE_CONFIGURATION AS PS ON PR.configuration_id = PS.configuration_id
        INNER JOIN BASELINE_GROUP as BG ON PS.baseline_group_id = BG.baseline_group_id
        INNER JOIN SKETCH AS S ON BG.category_id = S.category_id AND PR.sketch_id = S.sketch_id
        WHERE PR.configuration_id = p_configuration_id
        ORDER BY PR.result_id;
    
    END IF;
END$$
DELIMITER ;



