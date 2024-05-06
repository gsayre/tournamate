module default {
  scalar type tournamentFormats extending enum<`none`, `same sex doubles`, `coed doubles`, `reverse coed doubles`, `same sex sixes`, `coed sixes`, `reverse coed quads`, `same sex triples`>;
  scalar type tournamentTypes extending enum<`none`, `grass`, `sand`, `indoor`>;
   type Tournament {
       required  name: str;
       required  tournamentType: tournamentTypes;
       required dayOne: bool {
            default := true;
       };
       required dayOneDate: datetime;
       required dayOneFormat: tournamentFormats;
    dayOneStarted: bool {
            default := false;
        
    };
       required dayTwo: bool {
          default := false;
      };
        dayTwoDate: datetime;
        dayTwoFormat: tournamentFormats;
        dayTwoStarted: bool;
       
  };
}

using extension auth;