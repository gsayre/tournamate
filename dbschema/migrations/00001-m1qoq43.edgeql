CREATE MIGRATION m1qoq437hgg5z2bdmas7cst3ie4twx54owmuvzxlh2ch4mdagnqjuq
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE SCALAR TYPE default::tournamentFormats EXTENDING enum<none, `same sex doubles`, `coed doubles`, `reverse coed doubles`, `same sex sixes`, `coed sixes`, `reverse coed quads`, `same sex triples`>;
  CREATE SCALAR TYPE default::tournamentType EXTENDING enum<none, grass, sand, indoor>;
  CREATE TYPE default::Tournament {
      CREATE REQUIRED PROPERTY dayOne: std::bool;
      CREATE REQUIRED PROPERTY dayOneDate: std::datetime;
      CREATE REQUIRED PROPERTY dayOneFormat: default::tournamentFormats;
      CREATE REQUIRED PROPERTY dayOneStarted: std::bool;
      CREATE REQUIRED PROPERTY dayTwo: std::bool {
          SET default := false;
      };
      CREATE PROPERTY dayTwoDate: std::datetime;
      CREATE PROPERTY dayTwoFormat: default::tournamentFormats;
      CREATE PROPERTY dayTwoStarted: std::bool;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY type: default::tournamentType;
  };
};
