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
INSERT INTO USERS VALUE(2, 'prof1', 'prof1', 2);
INSERT INTO USERS VALUE(3, 'prof2', 'prof2', 2);
INSERT INTO USERS VALUE(4, 'prof3', 'prof3', 2);
INSERT INTO MODULE VALUE(0, 2, 'Réseaux', 'Configuration de réseaux internet', 0,' cle1', 3);
INSERT INTO MODULE VALUE(1, 3, 'Prog. System', 'Programmation d un OS', 0, 'cle2', 4);
INSERT INTO MODULE VALUE(2, 4, 'Future ?', 'Tu peux y arrivé ?', 5, 'cle3', 5);
INSERT INTO MODULE VALUE(3, 2, 'Programmation C', 'Apprendre a programmer en C', 0,' cle4', 3);
INSERT INTO MODULE VALUE(4, 3, 'Base de données', 'Apprendre a se servir des bases de données', 0,' cle5', 3);
INSERT INTO MODULE VALUE(5, 4, 'Web', 'Les bases des langage du web', 0,' cle6', 3);
INSERT INTO COMMENTAIRE VALUE(0, 0, 'cmt 1', 2,0);
INSERT INTO COMMENTAIRE VALUE(1, 0, 'cmt 2', 4,0);