/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Entity, UserEntity } from '@backstage/catalog-model';

export type EntityFilterType = 'field' | 'owned' | 'starred';

export type EntityFilter = {
  type: EntityFilterType;
  field?: string; // e.g. spec.type
  values: string[] | undefined;
};

export type EntityListState = {
  loading: boolean;
  error?: Error;
  entities: Entity[];
  entityTypes: string[];
  ownUser: Entity | undefined;
  starredEntities: string[]; // name of entity
  filters: Record<string, EntityFilter>;
  matchingEntities: Entity[];
  availableTags: string[];
};
