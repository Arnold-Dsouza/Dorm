import type { DormConfig, DormRegistry } from '@/dorms/types';
import { tabuDorm } from '@/dorms/tabu/config';
import { pariserDorm } from '@/dorms/pariser/config';

export const dormRegistry: DormRegistry = {
  [tabuDorm.id]: tabuDorm,
  [pariserDorm.id]: pariserDorm,
};

export const defaultDormId = tabuDorm.id;

export function getDormConfig(id?: string): DormConfig {
  if (id && dormRegistry[id]) {
    return dormRegistry[id];
  }
  return dormRegistry[defaultDormId];
}

export function getDormRegistry(): DormRegistry {
  return dormRegistry;
}
