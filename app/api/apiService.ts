import axios from "axios";
import client from "./client";


export const fetchPets = async (page: number, limit: number, session:string) => {
    try {
        const response = await axios.get(client + `filter/pets`, {
            headers: {
                Authorization: `Bearer ${session}`,
            },
            params: {
                page,
                limit,
            },
        });
        return response.data.cards;
    } catch (error) {
        console.error("Erreur lors de la récupération des animaux :", error);
        throw error;
    }
};
