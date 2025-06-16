import { Router, Request, Response } from "express";
import Locker from "../models/Locker";

const router = Router();

// GET - tous les casiers
router.get("/", async (_req: Request, res: Response) => {
  try {
    const lockers = await Locker.find();
    res.json(lockers);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST - ajouter un casier
router.post("/", async (req: Request, res: Response) => {
  try {
    const { number, size, price } = req.body;
    const locker = new Locker({ number, size, price });
    await locker.save();
    res.status(201).json(locker);
  } catch (error) {
    res.status(400).json({ message: "Données invalides" });
  }
});

// PUT - modifier un casier
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const locker = await Locker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!locker) {
      res.status(404).json({ message: "Casier non trouvé" });
      return;
    }
    res.json(locker);
  } catch (error) {
    res.status(400).json({ message: "Données invalides" });
  }
});

// DELETE - supprimer un casier
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const locker = await Locker.findByIdAndDelete(req.params.id);
    if (!locker) {
      res.status(404).json({ message: "Casier non trouvé" });
      return;
    }
    res.json({ message: "Casier supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});


export default router;
