--------------------------------------------------------
--  File created - sobota-marca-15-2025   
--------------------------------------------------------
DROP SEQUENCE "TODO"."INCREMENT_ID";
DROP TABLE "TODO"."TASK";
DROP PROCEDURE "TODO"."ADD_TASK";
DROP PROCEDURE "TODO"."DELETE_TASK";
DROP PROCEDURE "TODO"."STATUS_UPDATE";
DROP PROCEDURE "TODO"."UPDATE_TASK";
--------------------------------------------------------
--  DDL for Sequence INCREMENT_ID
--------------------------------------------------------

   CREATE SEQUENCE  "TODO"."INCREMENT_ID"  MINVALUE 1 MAXVALUE 999 INCREMENT BY 1 START WITH 1 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
--------------------------------------------------------
--  DDL for Table TASK
--------------------------------------------------------

  CREATE TABLE "TODO"."TASK" 
   (	"ID" NUMBER, 
	"DESCRIPTION" VARCHAR2(50 BYTE), 
	"STATUS" VARCHAR2(30 BYTE), 
	"FINISH_DATE" DATE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
REM INSERTING into TODO.TASK
SET DEFINE OFF;

--------------------------------------------------------
--  DDL for Index SYS_C008272
--------------------------------------------------------

  CREATE UNIQUE INDEX "TODO"."SYS_C008272" ON "TODO"."TASK" ("ID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  DDL for Index SYS_C008272
--------------------------------------------------------

  CREATE UNIQUE INDEX "TODO"."SYS_C008272" ON "TODO"."TASK" ("ID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  DDL for Procedure ADD_TASK
--------------------------------------------------------
set define off;

  CREATE OR REPLACE EDITIONABLE PROCEDURE "TODO"."ADD_TASK" (
    p_description IN VARCHAR2,
    p_status   IN VARCHAR2,
    p_finish_date IN DATE
) AS
BEGIN 

    IF p_description IS NULL OR LENGTH(p_description) = 0 THEN 
        RAISE_APPLICATION_ERROR(-20001, 'Description cannot be empty');
    END IF;
    IF p_status NOT IN ('New', 'In progress', 'Done') THEN
        RAISE_APPLICATION_ERROR(-20002, 'Invalid status');
    END IF;
    IF p_finish_date < SYSDATE THEN
        RAISE_APPLICATION_ERROR(-20003, 'The end date cannot be in the past');
    END IF;

    INSERT INTO TASK(id, description, status, finish_date)
    VALUES(increment_id.NEXTVAL, p_description, p_status, p_finish_date);

    COMMIT;
END add_task;

/
--------------------------------------------------------
--  DDL for Procedure DELETE_TASK
--------------------------------------------------------
set define off;

  CREATE OR REPLACE EDITIONABLE PROCEDURE "TODO"."DELETE_TASK" (
    p_id IN NUMBER
) AS
BEGIN 
    DECLARE 
    v_id NUMBER;
    BEGIN
        SELECT id INTO v_id FROM TASK WHERE id = p_id;

        IF v_id <> p_id THEN 
        RAISE_APPLICATION_ERROR(-20005, 'The record with the specified ID does not exist.');

        ELSE
            DELETE FROM TASK
            WHERE id = p_id;

        END IF;
    END;
    COMMIT;
END;

/
--------------------------------------------------------
--  DDL for Procedure STATUS_UPDATE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE EDITIONABLE PROCEDURE "TODO"."STATUS_UPDATE" 
AS 
BEGIN
        UPDATE TASK SET 
        status = 'Done'
        WHERE id IN (
                SELECT t.id FROM TASK t
                WHERE TRUNC(t.finish_date) < TRUNC(SYSDATE)
                AND t.status <> 'Done'  
                );
    COMMIT;
END;

/
--------------------------------------------------------
--  DDL for Procedure UPDATE_TASK
--------------------------------------------------------
set define off;

  CREATE OR REPLACE EDITIONABLE PROCEDURE "TODO"."UPDATE_TASK" (
    p_id IN NUMBER,
    p_description IN VARCHAR2,
    p_status   IN VARCHAR2,
    p_finish_date IN DATE
) AS
BEGIN 
    DECLARE 
    v_id NUMBER;
    BEGIN
        SELECT id INTO v_id FROM TASK WHERE id = p_id;

        IF v_id <> p_id THEN 
        RAISE_APPLICATION_ERROR(-20005, 'The record with the specified ID does not exist.');

        ELSE 
            IF p_description IS NULL OR LENGTH(p_description) = 0 THEN 
                RAISE_APPLICATION_ERROR(-20001, 'Description cannot be empty');
            END IF;
            IF p_status NOT IN ('New', 'In progress', 'Done') THEN
                RAISE_APPLICATION_ERROR(-20002, 'Invalid status');
            END IF;
            IF p_finish_date < SYSDATE THEN
                RAISE_APPLICATION_ERROR(-20003, 'The end date cannot be in the past');
            END IF;

            UPDATE TASK SET 
            description = p_description, 
            status = p_status, 
            finish_date = p_finish_date
            WHERE id = p_id;

        END IF;
    END;
    COMMIT;
END;

/
--------------------------------------------------------
--  DBMS_SCHEDULER for Procedure STATUS_UPDATE
--------------------------------------------------------

BEGIN
  DBMS_SCHEDULER.CREATE_JOB (
   job_name           =>  'check_task_status',
   job_type           =>  'PLSQL_BLOCK',
   job_action         =>  'BEGIN status_update; END;',
   start_date         =>   SYSTIMESTAMP,
   repeat_interval    =>  'FREQ=DAILY;BYHOUR=23; BYMINUTE=59;', /* every other day */
   enabled            =>   TRUE,
   comments           =>  'Sheduler to check task status.');
END;
/

--------------------------------------------------------
--  Constraints for Table TASK
--------------------------------------------------------

  ALTER TABLE "TODO"."TASK" MODIFY ("DESCRIPTION" NOT NULL ENABLE);
  ALTER TABLE "TODO"."TASK" ADD PRIMARY KEY ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS"  ENABLE;
