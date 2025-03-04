import axios from "axios";

const STATS_REST_API_BASE_URL = "http://localhost:3000/api/stats";

export const countUser = () => axios.get(STATS_REST_API_BASE_URL);
