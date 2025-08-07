import { Request, Response } from 'express';
import characterService from '../services/character.service';
import { CreateCharacterData, UpdateCharacterData } from '../types/character.types';

export class CharacterController {
  async getAllCharacters(req: Request, res: Response): Promise<void> {
    try {
      const characters = await characterService.getAllCharacters();
      res.json(characters);
    } catch (error) {
      console.error('Error fetching characters:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCharacterById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid character ID' });
        return;
      }

      const character = await characterService.getCharacterById(id);
      if (!character) {
        res.status(404).json({ error: 'Character not found' });
        return;
      }

      res.json(character);
    } catch (error) {
      console.error('Error fetching character:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createCharacter(req: Request, res: Response): Promise<void> {
    try {
      const characterData: CreateCharacterData = req.body;
      
      // Check if character with same name already exists
      const existingCharacter = await characterService.getCharacterByName(characterData.name);
      if (existingCharacter) {
        res.status(400).json({ error: 'Character with this name already exists' });
        return;
      }

      const character = await characterService.createCharacter(characterData);
      res.status(201).json(character);
    } catch (error) {
      console.error('Error creating character:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateCharacter(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid character ID' });
        return;
      }

      const updateData: UpdateCharacterData = req.body;
      
      // Check if character exists
      const existingCharacter = await characterService.getCharacterById(id);
      if (!existingCharacter) {
        res.status(404).json({ error: 'Character not found' });
        return;
      }

      // Check if name is being updated and if it conflicts with another character
      if (updateData.name && updateData.name !== existingCharacter.name) {
        const characterWithSameName = await characterService.getCharacterByName(updateData.name);
        if (characterWithSameName) {
          res.status(400).json({ error: 'Character with this name already exists' });
          return;
        }
      }

      const [affectedCount, updatedCharacters] = await characterService.updateCharacter(id, updateData);
      if (affectedCount === 0) {
        res.status(404).json({ error: 'Character not found' });
        return;
      }

      res.json(updatedCharacters[0]);
    } catch (error) {
      console.error('Error updating character:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteCharacter(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid character ID' });
        return;
      }

      const deletedCount = await characterService.deleteCharacter(id);
      if (deletedCount === 0) {
        res.status(404).json({ error: 'Character not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting character:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new CharacterController();
