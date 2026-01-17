import { Badge } from "./ui/badge";

interface SpeakerCardProps {
  image: string;
  name: string;
  title: string;
  affiliation: string;
  expertise: string;
  type: string;
}

export const SpeakerCard = ({
  image,
  name,
  title,
  affiliation,
  expertise,
  type,
}: SpeakerCardProps) => {
  return (
    <div className="group w-[240px] sm:w-[260px] relative overflow-hidden shadow-lg">
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-primary to-secondary">
        <img
          src={image}
          alt={`${name} - ${title}`}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <Badge
            variant={type === "keynote" ? "default" : "secondary"}
            className={`${
              type === "keynote" ? "bg-primary shadow-lg" : "bg-secondary"
            } text-xs px-2 py-1 backdrop-blur-sm`}
          >
            {title}
          </Badge>
        </div>
      </div>

      {/* Text Section */}
      <div className="p-2 space-y-2 bg-black rounded-b-lg">
        <h3 className="text-lg font-bold text-white truncate">{name}</h3>

        <p className="text-muted-foreground font-medium text-xs">{expertise}</p>

        <p className="text-gray-200/80 text-xs leading-relaxed font-medium truncate">
          {affiliation}
        </p>

        <div className="h-1 w-0 bg-gradient-primary rounded-full group-hover:w-16 transition-all duration-500 ease-out" />
      </div>
    </div>
  );
};
