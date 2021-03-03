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

import { UserEntity } from '@backstage/catalog-model';
import { identityApiRef, useApi } from '@backstage/core';
import {
  catalogApiRef,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { useContext, useEffect, useMemo } from 'react';
// import { useOwnUser } from '../components/useOwnUser';
import { entityListContext } from './context';
import { loadEntities, setOwnUser, loadStarredEntities } from './reducer';

export const useEntityListState = () => {
  const context = useContext(entityListContext);
  if (!context) {
    throw new Error(`Must be used inside an EntityListProvider`);
  }
  const { state, dispatch } = context;

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);
  const { starredEntities } = useStarredEntities();

  useEffect(() => {
    const initialLoad = async () => {
      const entities = await catalogApi
        .getEntities({
          filter: { kind: 'Component' },
        })
        .then(r => r.items);

      const ownUser = await catalogApi.getEntityByName({
        kind: 'User',
        namespace: 'default',
        name: identityApi.getUserId(),
      });

      dispatch(loadEntities(entities));
      dispatch(setOwnUser(ownUser));
      dispatch(loadStarredEntities([...starredEntities]));
    };
    initialLoad();
  }, [catalogApi, identityApi, starredEntities, dispatch]);

  return { state: contextValue.state, dispatch: contextValue.dispatch };
};
