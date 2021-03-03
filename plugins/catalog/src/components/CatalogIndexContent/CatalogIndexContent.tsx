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

import {
  Content,
  ContentHeader,
  SupportButton,
  useRouteRef,
} from '@backstage/core';
import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { createComponentRouteRef } from '../../routes';
import { useEntityListState } from '../../state';
// import { useMockData } from './useMockData';
import {
  EntityFilterGroupBar,
  FilterGroupItem,
  filterGroups,
} from '../CatalogFilter';
import { CatalogTable } from '../CatalogTable/CatalogTable';
import { ResultsFilterNew } from '../ResultsFilter/ResultsFilterNew';
import { EntityTypeFilter } from '../EntityTypeFilter/EntityTypeFilter';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
  buttonSpacing: {
    marginLeft: theme.spacing(2),
  },
}));

export const CatalogIndexContent = () => {
  const styles = useStyles();

  const createComponentLink = useRouteRef(createComponentRouteRef);
  // const { addMockData, showAddExampleEntities } = useMockData();
  // const { filterGroups } = useFilterGroups();

  const { state } = useEntityListState();

  const selectedType = 'Catalog';

  return (
    <Content>
      <ContentHeader title={selectedType}>
        {createComponentLink && (
          <Button
            component={RouterLink}
            variant="contained"
            color="primary"
            to={createComponentLink()}
          >
            Create Component
          </Button>
        )}
        {/* {showAddExampleEntities && (
          <Button
            className={styles.buttonSpacing}
            variant="outlined"
            color="primary"
            onClick={addMockData}
          >
            Add example components
          </Button>
        )} */}
        <SupportButton>All your software catalog entities</SupportButton>
      </ContentHeader>
      <div className={styles.contentWrapper}>
        <div>
          <FilterGroupItem group="type">
            <EntityTypeFilter />
          </FilterGroupItem>
          <EntityFilterGroupBar
            buttonGroups={filterGroups}
            initiallySelected=""
          />
          {/* <CatalogFilter
            buttonGroups={filterGroups}
            onChange={({ label, id }) => setSelectedSidebarItem({ label, id })}
            initiallySelected={selectedSidebarItem?.id ?? 'owned'}
          />
           */}
          <ResultsFilterNew availableTags={state.availableTags} />
        </div>
        <CatalogTable
          titlePreamble="Catalog"
          entities={state.matchingEntities}
          loading={state.loading}
          error={state.error}
        />
      </div>
    </Content>
  );
};
