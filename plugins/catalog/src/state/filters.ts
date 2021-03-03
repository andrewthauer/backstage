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

import { Entity } from '@backstage/catalog-model';
import { isOwnerOf, isStarredEntity } from '@backstage/plugin-catalog-react';
import { EntityFilter } from './types';
import { get, isArray } from 'lodash';

export function filterEntities(
  entities: Entity[],
  filters: EntityFilter[],
  {
    starredEntities,
    ownUser,
  }: { starredEntities: string[]; ownUser: Entity | undefined },
) {
  let matchedEntities = entities;

  for (const filter of filters) {
    switch (filter.type) {
      case 'field':
        matchedEntities = filterEntityByField(matchedEntities, filter);
        break;
      case 'owned':
        matchedEntities = matchedEntities.filter(e =>
          ownUser ? isOwnerOf(ownUser, e) : true,
        );
        break;
      case 'starred':
        matchedEntities = matchedEntities.filter(e =>
          isStarredEntity(new Set(starredEntities), e),
        );
        break;
      default:
    }
  }

  return matchedEntities;
}

function filterEntityByField(entities: Entity[], filter: EntityFilter) {
  return entities.filter(e => {
    const { field = '', values = [] } = filter;
    const fieldValue = get(e, field);

    if (isArray(fieldValue)) {
      return values.some(r => fieldValue.includes(r));
    }

    return values.includes(fieldValue);
  });
}

// Given all entites, find all possible tags and provide them in a sorted list.
export function collectTags(entities?: Entity[]): string[] {
  const tags = new Set<string>();
  (entities || []).forEach(e => {
    if (e.metadata.tags) {
      e.metadata.tags.forEach(t => tags.add(t));
    }
  });
  return Array.from(tags).sort();
}
