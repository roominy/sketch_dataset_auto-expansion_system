DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_submit_sketch`(
	IN p_category_id INT,
    IN p_sketcher_id INT,
    IN p_sketch_image BLOB,
    IN p_sketch_strokes BLOB,
    IN p_user_created VARCHAR(45)
)
BEGIN


	IF ( SELECT NOT EXISTS (SELECT 1 FROM USER WHERE username =  p_user_created AND role = 'user' ) ) THEN
    
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized user.' , MYSQL_ERRNO = 1001;
        
    ELSE
     
        INSERT INTO SKETCH
        (   
			category_id,
            sketcher_id,
			sketch_image,
			sketch_strokes,
            user_created,
            user_modified
        )
        values
        (
            p_category_id,
            p_sketcher_id,
            p_sketch_image,
            p_sketch_strokes,
            p_user_created,
            p_user_created
        );
     
    END IF;

END$$
DELIMITER ;
