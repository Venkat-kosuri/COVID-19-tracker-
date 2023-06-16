import axios from "axios";

const BASEURL = "https://covid-193.p.rapidapi.com/";

export default axios.create({
  baseURL: BASEURL,

  headers: {
    "X-RapidAPI-Key": "c79d6575d7mshbc51460fc8adf03p1c3ebajsn58e525a23ed6",
    "X-RapidAPI-Host": "covid-193.p.rapidapi.com",
  },
});
