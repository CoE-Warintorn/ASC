create database db_asc;

use db_asc;

create table TB_USR_CTL (
    username        varchar(25)     not null,
    startDate       date            not null,
    endDate         date            not null,
    adminInd        enum('y','n')   not null,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    modifiedDate    timestamp       not null
        default now()   on update   now(),
    modifiedBy      varchar(25)     not null,

    primary key (username)
);

create table TB_PDG (
    pgCd            varchar(5)      not null,
    pgName          varchar(45)     not null,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    modifiedDate    timestamp       not null
        default now()   on update   now(),
    modifiedBy      varchar(25)     not null,
    primary key (pgCd),
    foreign key (createdBy)       references TB_USR_CTL(username),
    foreign key (modifiedBy)      references TB_USR_CTL(username)
);

create table TB_PRD (
    pdCd            int             not null auto_increment,
    pgCd            varchar(5)      not null,
    pdName          varchar(45)     not null,
    specification   text,
    tradingType     enum('hire', 'purchase')    not null,
    tradingProvider varchar(45),
    warrantyFrom    date,
    warrantyTo      date,
    detail          text,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    modifiedDate    timestamp       not null
        default now()   on update   now(),
    modifiedBy      varchar(25)     not null,
    primary key (pdCd),
    foreign key (pgCd)          references TB_PDG(pgCd),
    foreign key (createdBy)     references TB_USR_CTL(username),
    foreign key (modifiedBy)    references TB_USR_CTL(username)
);

create table TB_AST (
    astCd           varchar(15)     not null,
    pdCd            int             not null,
    serialNumber    varchar(45),
    detail          text,
    writeOffDate    date,
    reason          text,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    modifiedDate    timestamp       not null
        default now()   on update   now(),
    modifiedBy      varchar(25)     not null,
    primary key (astCd),
    foreign key (pdCd)          references TB_PRD(pdCd),
    foreign key (createdBy)     references TB_USR_CTL(username),
    foreign key (modifiedBy)    references TB_USR_CTL(username)
);

create table TB_APP (
    appCd           varchar(5)      not null,
    appName         varchar(45)     not null,
    active          enum('y','n')   not null,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    modifiedDate    timestamp       not null
        default now()   on update   now(),
    modifiedBy      varchar(25)     not null,
    primary key (appCd),
    foreign key (createdBy)     references TB_USR_CTL(username),
    foreign key (modifiedBy)    references TB_USR_CTL(username)
);

create table TB_BRCH (
    branchCd        varchar(5)      not null,
    branchName      varchar(45)     not null,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    modifiedDate    timestamp       not null
        default now()   on update   now(),
    modifiedBy      varchar(25)     not null,
    primary key (branchCd),
    foreign key (createdBy)     references TB_USR_CTL(username),
    foreign key (modifiedBy)    references TB_USR_CTL(username)
);

create table TB_DIV (
    divCd           varchar(5)      not null,
    divName         varchar(45)     not null,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    modifiedDate    timestamp       not null
        default now()   on update   now(),
    modifiedBy      varchar(25)     not null,
    primary key (divCd),
    foreign key (createdBy)     references TB_USR_CTL(username),
    foreign key (modifiedBy)    references TB_USR_CTL(username)
);

create table TB_DPM (
    dpmCd           varchar(5)      not null,
    dpmName         varchar(45)     not null,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    modifiedDate    timestamp       not null
        default now()   on update   now(),
    modifiedBy      varchar(25)     not null,
    primary key (dpmCd),
    foreign key (createdBy)     references TB_USR_CTL(username),
    foreign key (modifiedBy)    references TB_USR_CTL(username)
);

create table TB_USR (
    username        varchar(25)     not null,
    empCode         varchar(10)     not null,
    firstName       varchar(25)     not null,
    lastName        varchar(25)     not null,
    branchCd        varchar(5),
    divCd           varchar(5),
    dpmCd           varchar(5),
    intercom        varchar(15),
    phone           varchar(15),
    email           varchar(45),
    active          enum('y','n')   not null,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    modifiedDate    timestamp       not null
        default now()   on update   now(),
    modifiedBy      varchar(25)     not null,
    primary key (username),
    foreign key (createdBy)     references TB_USR_CTL(username),
    foreign key (modifiedBy)    references TB_USR_CTL(username),
    foreign key (branchCd)      references TB_BRCH(branchCd),
    foreign key (divCd)         references TB_DIV(divCd),
    foreign key (dpmCd)         references TB_DPM(dpmCd)
);

create table TB_USR_PMS (
    username        varchar(25)     not null,
    appCd           varchar(5)      not null,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    primary key (username, appCd),
    foreign key (username)      references TB_USR(username),
    foreign key (appCd)         references TB_APP(appCd),
    foreign key (createdBy)     references TB_USR_CTL(username)
);

create table TB_AST_ASM (
    astCd           varchar(15)     not null,
    startDate       date            not null,
    endDate         date            not null,
    branchCd        varchar(5),
    a_location      varchar(45),
    username        varchar(25),
    divCd           varchar(5),
    dpmCd           varchar(5),
    detail          text,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    modifiedDate    timestamp       not null
        default now()   on update   now(),
    modifiedBy      varchar(25)     not null,
    primary key (astCd, startDate),
    foreign key (astCd)         references TB_AST(astCd),
    foreign key (branchCd)      references TB_BRCH(branchCd),
    foreign key (divCd)         references TB_DIV(divCd),
    foreign key (dpmCd)         references TB_DPM(dpmCd),
    foreign key (username)      references TB_USR(username),
    foreign key (createdBy)     references TB_USR_CTL(username),
    foreign key (modifiedBy)    references TB_USR_CTL(username)
);

create table TB_REPAIR (
    astCd           varchar(15)     not null,
    repairDate      date            not null,
    returnDate      date,
    itSupporter     varchar(25)     not null,
    detail          text,
    createdDate     timestamp       not null
        default now(),
    createdBy       varchar(25)     not null,
    modifiedDate    timestamp       not null
        default now()   on update   now(),
    modifiedBy      varchar(25)     not null,
    primary key (astCd, repairDate),
    foreign key (astCd)         references TB_AST(astCd),
    foreign key (createdBy)     references TB_USR_CTL(username),
    foreign key (modifiedBy)    references TB_USR_CTL(username)
);