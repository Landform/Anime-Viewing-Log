WARNING:  database "postgres" has no actual collation version, but a version was recorded
--
-- PostgreSQL database cluster dump
--

\restrict ubPXXrYhFaEEuuUq5PE0XO6PC2znbOguWPcQxxWDBWXHSmdtaz1sW2sOtahRPUG

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE anime_db;




--
-- Drop roles
--

DROP ROLE anime_user;


--
-- Roles
--

CREATE ROLE anime_user;
ALTER ROLE anime_user WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:eJujDAWm+LvCA53lEFs9xQ==$PD/HwYG1YDwwQDH80nDTk9QBACSyqAjgULtWGs+MRCY=:AQ2HYY66YAt7PxYE+b6+UpOxJFoyJ9RqB3jr2r19ICU=';

--
-- User Configurations
--








\unrestrict ubPXXrYhFaEEuuUq5PE0XO6PC2znbOguWPcQxxWDBWXHSmdtaz1sW2sOtahRPUG

--
-- Databases
--

--
-- Database "template1" dump
--

WARNING:  database "template1" has no actual collation version, but a version was recorded
--
-- PostgreSQL database dump
--

\restrict yrZ015AAZ9NvmJ0HQDbOHCwdbvQMsDcXbhYPct7NneUDEtdTdCIVY1isKfnFDZ7

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: anime_user
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO anime_user;

\unrestrict yrZ015AAZ9NvmJ0HQDbOHCwdbvQMsDcXbhYPct7NneUDEtdTdCIVY1isKfnFDZ7
\connect template1
\restrict yrZ015AAZ9NvmJ0HQDbOHCwdbvQMsDcXbhYPct7NneUDEtdTdCIVY1isKfnFDZ7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: anime_user
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: anime_user
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\unrestrict yrZ015AAZ9NvmJ0HQDbOHCwdbvQMsDcXbhYPct7NneUDEtdTdCIVY1isKfnFDZ7
\connect template1
\restrict yrZ015AAZ9NvmJ0HQDbOHCwdbvQMsDcXbhYPct7NneUDEtdTdCIVY1isKfnFDZ7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: anime_user
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict yrZ015AAZ9NvmJ0HQDbOHCwdbvQMsDcXbhYPct7NneUDEtdTdCIVY1isKfnFDZ7

--
-- Database "anime_db" dump
--

WARNING:  database "anime_db" has no actual collation version, but a version was recorded
--
-- PostgreSQL database dump
--

\restrict IGGHPxC8OnZcKe7SzTj014Tc7IuVeX7EntGTSAHzrfV5HoCoWxqDekFqSt4kVfq

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: anime_db; Type: DATABASE; Schema: -; Owner: anime_user
--

CREATE DATABASE anime_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE anime_db OWNER TO anime_user;

\unrestrict IGGHPxC8OnZcKe7SzTj014Tc7IuVeX7EntGTSAHzrfV5HoCoWxqDekFqSt4kVfq
\connect anime_db
\restrict IGGHPxC8OnZcKe7SzTj014Tc7IuVeX7EntGTSAHzrfV5HoCoWxqDekFqSt4kVfq

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict IGGHPxC8OnZcKe7SzTj014Tc7IuVeX7EntGTSAHzrfV5HoCoWxqDekFqSt4kVfq

--
-- Database "postgres" dump
--

WARNING:  database "postgres" has no actual collation version, but a version was recorded
--
-- PostgreSQL database dump
--

\restrict ciMK9rahNdRkqGBOnXoiPkseNDjufGXUUpBhTlUJfbpioGxMkkY43VoMXLHK107

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: anime_user
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO anime_user;

\unrestrict ciMK9rahNdRkqGBOnXoiPkseNDjufGXUUpBhTlUJfbpioGxMkkY43VoMXLHK107
\connect postgres
\restrict ciMK9rahNdRkqGBOnXoiPkseNDjufGXUUpBhTlUJfbpioGxMkkY43VoMXLHK107

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: anime_user
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

\unrestrict ciMK9rahNdRkqGBOnXoiPkseNDjufGXUUpBhTlUJfbpioGxMkkY43VoMXLHK107

--
-- PostgreSQL database cluster dump complete
--

