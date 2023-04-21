import { Character } from "@/components/Table";
import { api } from "..";

interface updatePersonProps {
	id: number;
	data: Partial<Character>;
}

interface getPeopleProps {
	page?: number;
	limit?: number;
}

export const getPeople = async ({ page, limit }: getPeopleProps) => {
	return await api<Character[]>({
		method: "GET",
		url: "/people",
		params: {
			_page: page,
			_limit: limit,
		},
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
