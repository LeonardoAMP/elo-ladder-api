export interface CharacterData {
  id?: number;
  name: string;
  icon_name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCharacterData {
  name: string;
  icon_name: string;
}

export interface UpdateCharacterData {
  name?: string;
  icon_name?: string;
}
