let roomParticipants: Set<string> = new Set();

export const addParticipant = (participantId: string) => {
  roomParticipants.add(participantId);
};

export const removeParticipant = (participantId: string) => {
  roomParticipants.delete(participantId);
};

export const getParticipantCount = () => {
  return Array.from(roomParticipants);
};
