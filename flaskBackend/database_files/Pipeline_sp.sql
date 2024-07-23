DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_get_categories_with_active_piplene`()
BEGIN

	SELECT 
		C.category_id,
        C.category_name, 
        BG.baseline_group_id, 
        PS.configuration_id,
        PS.threshold
	FROM
		CATEGORY AS C
		JOIN BASELINE_GROUP AS BG ON C.category_id = BG.category_id
		JOIN PIPELINE_SETUP AS PS ON BG.baseline_group_id = PS.baseline_group_id 
	WHERE 
		PS.status = 'active';
        
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_get_category_baselines`(
	p_baseline_group_id INT
)
BEGIN

	SELECT
		baseline_id AS id,
		-- CONVERT(baseline_sketch USING utf8),
		TO_BASE64(baseline_sketch) AS sketch
	FROM
		BASELINE_SKETCH 
	WHERE 
		baseline_group_id = p_baseline_group_id ;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_get_category_sketch_withno_results`(
	p_category_id INT,
    p_configuration_id INT
)
BEGIN

	SELECT 
		S.sketch_id AS id,
		TO_BASE64(S.sketch_image) AS sketch
	FROM
		SKETCH AS S
		JOIN CATEGORY AS C ON S.category_id = C.category_id
	WHERE 
		S.category_id = p_category_id
		AND S.sketch_id NOT IN (SELECT 
									PR.sketch_id
								FROM 
									PIPELINE_RESULTS AS PR
								WHERE PR.configuration_id = p_configuration_id);

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`sketchadmin`@`%` PROCEDURE `sp_insert_pipline_results`(
	IN p_results_json JSON
)
BEGIN

	DECLARE v_total_items INT;
    DECLARE v_counter INT DEFAULT 0;
    DECLARE v_sketch_id INT;
    DECLARE v_configuration_id INT;
	DECLARE v_result ENUM('positive', 'negative');
    
    SET v_total_items = JSON_LENGTH(p_results_json);
    
    loop_label: LOOP
		IF v_counter >= v_total_items THEN
			LEAVE loop_label;
		END IF;
        
        SET v_sketch_id = JSON_UNQUOTE(JSON_EXTRACT(p_results_json, CONCAT('$[', v_counter, '].sketch_id')));
		SET v_configuration_id = JSON_UNQUOTE(JSON_EXTRACT(p_results_json, CONCAT('$[', v_counter, '].configuration_id')));
        SET v_result = JSON_UNQUOTE(JSON_EXTRACT(p_results_json, CONCAT('$[', v_counter, '].result')));
        
        INSERT INTO PIPELINE_RESULTS
            (
				sketch_id,
                configuration_id,
                result
            )
            VALUES
            (
				v_sketch_id,
                v_configuration_id,
                v_result
            );
            
	 SET v_counter = v_counter + 1;
	END LOOP;
    

END$$
DELIMITER ;


