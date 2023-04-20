import { Character } from "@/components/Table";
import { api } from "..";

interface updateProgressProps {
  item: Character;
  countProgress: string;
}

export const updateProgress = async ({
  item,
  countProgress,
}: updateProgressProps) => {
  return await api({
    method: "PATCH",
    url: `/people/${item.id}`,
    data: {
      progress: countProgress,
    },
  });
};
