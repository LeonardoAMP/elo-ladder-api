import { Request, Response } from 'express';
import characterService from '../services/character.service';
import { CreateCharacterData, UpdateCharacterData } from '../types/character.types';

/**
 * @swagger
 * tags:
 *   name: Characters
 *   description: SSBU character management endpoints
 */

export class CharacterController {
  /**
   * @swagger
   * /characters:
   *   get:
   *     summary: Get all SSBU characters
   *     tags: [Characters]
   *     responses:
   *       200:
   *         description: List of all SSBU characters
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Character'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getAllCharacters(req: Request, res: Response): Promise<void> {
    try {
      const characters = await characterService.getAllCharacters();
      res.json(characters);
    } catch (error) {
      console.error('Error fetching characters:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * @swagger
   * /characters/{id}:
   *   get:
   *     summary: Get a character by ID
   *     tags: [Characters]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Character ID
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Character found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Character'
   *       400:
   *         description: Invalid character ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Character not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /characters:
   *   post:
   *     summary: Create a new character
   *     tags: [Characters]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - icon_name
   *             properties:
   *               name:
   *                 type: string
   *                 description: The character's name
   *                 example: Mario
   *               icon_name:
   *                 type: string
   *                 description: The character's icon filename
   *                 example: mario
   *     responses:
   *       201:
   *         description: Character created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Character'
   *       400:
   *         description: Bad request (character already exists)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /characters/{id}:
   *   put:
   *     summary: Update a character
   *     tags: [Characters]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Character ID
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The character's name
   *                 example: Mario
   *               icon_name:
   *                 type: string
   *                 description: The character's icon filename
   *                 example: mario
   *     responses:
   *       200:
   *         description: Character updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Character'
   *       400:
   *         description: Bad request (invalid ID or name conflict)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Character not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /characters/{id}:
   *   delete:
   *     summary: Delete a character
   *     tags: [Characters]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Character ID
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Character deleted successfully
   *       400:
   *         description: Invalid character ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Character not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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
