import userRepository from "./userRepository";
import type {RequestHandler} from "express";


const addUser: RequestHandler = async (req, res, next) => {
  try {

 console.log("Requête reçue:", req.body); 

    const userId = await userRepository.create(req.body);
    res.status(201).json({ id: userId });
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur:", err);
    next(err);
  }
}

const getUSer: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
};


export default { addUser, getUSer };


