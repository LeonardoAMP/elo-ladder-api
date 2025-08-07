import { Character } from '../models';
import { CreateCharacterData, UpdateCharacterData } from '../types/character.types';

export class CharacterService {
  async getAllCharacters(): Promise<Character[]> {
    return await Character.findAll({
      order: [['name', 'ASC']]
    });
  }

  async getCharacterById(id: number): Promise<Character | null> {
    return await Character.findByPk(id);
  }

  async getCharacterByName(name: string): Promise<Character | null> {
    return await Character.findOne({
      where: { name }
    });
  }

  async createCharacter(characterData: CreateCharacterData): Promise<Character> {
    return await Character.create(characterData as any);
  }

  async updateCharacter(id: number, updateData: UpdateCharacterData): Promise<[number, Character[]]> {
    return await Character.update(updateData, {
      where: { id },
      returning: true
    });
  }

  async deleteCharacter(id: number): Promise<number> {
    return await Character.destroy({
      where: { id }
    });
  }
}

export default new CharacterService();
