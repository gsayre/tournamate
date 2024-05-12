CREATE MIGRATION m1aw7rvee2pciupogbtzxj4qefviweu4uubygdogrydhwfumm7gdra
    ONTO m1meqhnjmxwu34bzvo6e7foqf2rz2tcl75ayrfxafxnvbmcsgwuyva
{
  ALTER TYPE default::Tournament {
      CREATE REQUIRED LINK tournamentDirector: default::User {
          SET default := (GLOBAL default::currentUser);
      };
  };
};
