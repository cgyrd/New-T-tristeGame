import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */


/* ************************************************************************* */

// I connect my userActions, et userReposotiry 

import userActions from "./modules/userActions";

router.post("/api/user", userActions.addUser);
router.get("/api/user/:id", userActions.getUSer);



export default router;
