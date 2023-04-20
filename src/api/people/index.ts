import { Character } from "@/components/Table";
import { api } from "..";

interface updatePersonProps {
  id: number;
  data: Partial<Character>;
}

export const getPeople = async () => {
  return await api({
    method: "GET",
    url: "/people",
  });
};

export const updatePerson = async ({ id, data }: updatePersonProps) => {
  return await api({
    method: "PATCH",
    url: `/people/${id}`,
    data: {
      ...data,
    },
  });
};
