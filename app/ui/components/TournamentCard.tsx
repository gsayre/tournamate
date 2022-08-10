import moment from 'moment';
import { Link } from 'remix';
import {redirect} from '@remix-run/node'

interface Props {
  name: string;
  location: string;
  date: string;
  formats: string[];
}

export default function TournamentCard(props: Props) {
  return (
    <div className="flex h-28 w-full flex-row items-center space-x-8 rounded-xl bg-[#F3F4F6]/50 p-4 hover:h-32 hover:bg-[#F3F4F6]/95">
      <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-[#2196F3] p-2">
        <p className="text-2xl">
          {moment(props.date).format('MMM Do YY').split(' ')[1]}
        </p>
        <p className="text-xl">
          {moment(props.date).format('MMM Do YY').split(' ')[0]}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-2xl font-semibold tracking-widest">{props.name}</p>
        <p className="text-lg font-light tracking-wider">{props.location}</p>
      </div>
      <div className="flex h-12 w-48 items-center justify-center rounded-xl bg-[#F24E1E]/[.35] hover:bg-[#F24E1E]">
        <Link
          to={`./${props.name}/register`}
          className="text-lg font-semibold text-black opacity-100"
        >
          Enter Tournament!
        </Link>
      </div>
      <p>{props.formats.map((format, i) => {
        return(<span key={i}>{format + " "}</span>)
      })}</p>
    </div>
  );
}
