CREATE MIGRATION m1meqhnjmxwu34bzvo6e7foqf2rz2tcl75ayrfxafxnvbmcsgwuyva
    ONTO m1qoq437hgg5z2bdmas7cst3ie4twx54owmuvzxlh2ch4mdagnqjuq
{
  CREATE TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY name: std::str;
  };
  CREATE GLOBAL default::currentUser := (SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  );
  ALTER TYPE default::Tournament {
      ALTER PROPERTY dayOne {
          SET default := true;
      };
      ALTER PROPERTY dayOneStarted {
          SET default := false;
          RESET OPTIONALITY;
      };
  };
  ALTER SCALAR TYPE default::tournamentType RENAME TO default::tournamentTypes;
  ALTER TYPE default::Tournament {
      ALTER PROPERTY type {
          RENAME TO tournamentType;
      };
  };
};
