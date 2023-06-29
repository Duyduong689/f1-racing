import axios from "axios";
export const baseURL = "https://www.formula1.com/en/results/jcr:content/resultsarchive.html";
const axiosBase = axios.create({
  baseURL: baseURL,
});
export default axiosBase;