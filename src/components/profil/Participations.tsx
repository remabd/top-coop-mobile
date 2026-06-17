import { ParticipationAvecCreneauEtCoParticipants } from '../../models/participation.type';
import { Accordeon } from '../Accordeon';
import { ListeParticipation } from '../participations/ListeParticipations';

export function Participations(props: {
  participations: ParticipationAvecCreneauEtCoParticipants[];
  onAnnulee?: (participation: ParticipationAvecCreneauEtCoParticipants) => void;
}) {
  return (
    <Accordeon
      title="Mes participations"
      body={
        <ListeParticipation
          participations={props.participations}
          apercu={6}
          onAnnulee={props.onAnnulee}
        />
      }
    />
  );
}
