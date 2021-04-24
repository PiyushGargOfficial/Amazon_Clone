import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5001/clone-3c328/us-central1/api", //The API cloud function
});

export default instance;

//We made the backend using express and therefore, we have a local host baseURL.
//We created this instance of baseURL so that we dont have to write the baseURL along with the parameter calls everytime, we make a call.
