import { api } from "..";

export const fetchPeople = async () => {
  return await api({
    method: "GET",
    url: "/people",
  });
};
