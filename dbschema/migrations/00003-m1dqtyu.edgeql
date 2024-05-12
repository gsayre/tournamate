CREATE MIGRATION m1dqtyuzw72wmla5u5pnnc56uhbmdpc2fcuxfz3x2ijpw4ukiibjda
    ONTO m1meqhnjmxwu34bzvo6e7foqf2rz2tcl75ayrfxafxnvbmcsgwuyva
{
  ALTER TYPE default::Tournament {
      CREATE REQUIRED LINK tournamentDirector: default::User {
          SET default := (GLOBAL default::currentUser);
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK tournamentsDirected := (.<tournamentDirector[IS default::Tournament]);
  };
};
