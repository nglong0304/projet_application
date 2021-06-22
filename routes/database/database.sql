drop table COMMENTAIRE;
drop table MODULE;
drop table USERS;
drop table SECTION;

CREATE TABLE USERS(
    ID_USER INT,
    USER_NAME VARCHAR(50),
    USER_PASSWORD VARCHAR(255),
    TYPE INT,
    PRIMARY KEY (ID_USER)
);
CREATE TABLE SECTION(
    ID_SECTION INT,
    NAME_SECTION VARCHAR(50),
    LINK VARCHAR(100),
    PRIMARY KEY (ID_SECTION)
);
CREATE TABLE MODULE(
    ID_MODULES INT,
    ID_USER INT,
    NAME_MODULE VARCHAR(255),
    DESCRIPTION VARCHAR(1024),
    ID_SECTION INT,
    CLE VARCHAR(50),
    MOYEN_NOTE FLOAT,
    PRIMARY KEY (ID_MODULES),
    FOREIGN KEY (ID_USER) REFERENCES USERS(ID_USER),
    FOREIGN KEY (ID_SECTION) REFERENCES SECTION(ID_SECTION)
);
CREATE TABLE COMMENTAIRE(
    ID_CMT INT,
    ID_MODULES INT,
    CMT VARCHAR(1024),
    NOTE INT,
    VALID INT,
    PRIMARY KEY (ID_CMT),
    FOREIGN KEY (ID_MODULES) REFERENCES MODULE(ID_MODULES)
);
INSERT INTO SECTION VALUE(0, 'STI 3A', '/images/sti.jpg');
INSERT INTO SECTION VALUE(1, 'STI 4A', '/images/sti.jpg');
INSERT INTO SECTION VALUE(2, 'STI 5A', '/images/sti.jpg');
INSERT INTO SECTION VALUE(3, 'MRI 3A', '/images/mri.jpg');
INSERT INTO SECTION VALUE(4, 'MRI 4A', '/images/mri.jpg');
INSERT INTO SECTION VALUE(5, 'MRI 5A', '/images/mri.jpg');
INSERT INTO USERS VALUE(0, 'admin', 'admin', 0);
INSERT INTO USERS VALUE(1, 'delegues', 'delegues', 1);
INSERT INTO USERS VALUE(2, 'prof', 'prof', 2);
INSERT INTO MODULE VALUE(0, 2, 'module 1', 'description de module 1', 0,' cle1', 3);
INSERT INTO MODULE VALUE(1, 2, 'module 2', 'description de module 2', 0, 'cle2', 4);
INSERT INTO MODULE VALUE(2, 2, 'module 3', 'description de module 3', 5, 'cle3', 5);
INSERT INTO COMMENTAIRE VALUE(0, 0, 'cmt 1', 2,NULL);
INSERT INTO COMMENTAIRE VALUE(1, 0, 'cmt 2', 4,NULL);