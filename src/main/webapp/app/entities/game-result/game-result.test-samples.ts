import { GameEnding } from 'app/entities/enumerations/game-ending.model';

import { IGameResult, NewGameResult } from './game-result.model';

export const sampleWithRequiredData: IGameResult = {
  id: 32744,
};

export const sampleWithPartialData: IGameResult = {
  id: 26115,
  gameEnding: GameEnding['BYE'],
};

export const sampleWithFullData: IGameResult = {
  id: 33207,
  gameEnding: GameEnding['REVERSE_DISH'],
  p1Score: 80285,
  p2Score: 73534,
};

export const sampleWithNewData: NewGameResult = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
