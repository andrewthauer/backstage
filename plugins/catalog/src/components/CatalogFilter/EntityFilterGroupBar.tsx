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

import { IconComponent } from '@backstage/core';
import {
  Card,
  List,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  MenuItem,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { applyFilter, removeFilter, useEntityListState } from '../../state';
import { FilterGroupItem } from './FilterGroupItem';

export type ButtonGroup = {
  name: string;
  items: {
    id: string;
    label: string;
    icon?: IconComponent;
  }[];
};

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .11)',
    boxShadow: 'none',
  },
  title: {
    margin: theme.spacing(1, 0, 0, 1),
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listIcon: {
    minWidth: 30,
    color: theme.palette.text.primary,
  },
  menuItem: {
    minHeight: theme.spacing(6),
  },
  groupWrapper: {
    margin: theme.spacing(1, 1, 2, 1),
  },
  menuTitle: {
    fontWeight: 500,
  },
}));

type OnChangeCallback = (item: { id: string; label: string }) => void;

type Props = {
  buttonGroups: ButtonGroup[];
  initiallySelected: string;
  onChange?: OnChangeCallback;
};

/**
 * The main filter group in the sidebar, toggling owned/starred/all.
 */
export const EntityFilterGroupBar = ({
  buttonGroups,
  onChange,
  initiallySelected,
}: Props) => {
  const classes = useStyles();
  const { state, dispatch } = useEntityListState();
  const [currentFilter, setCurrentFilter] = useState(initiallySelected);

  const onChangeRef = useRef<OnChangeCallback>();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const filterId = 'filterBar';

  const setCurrent = useCallback(
    (item: { id: string; label: string }) => {
      setCurrentFilter(item.id);
      dispatch(
        item.id !== 'all'
          ? applyFilter({
              id: filterId,
              type: item.id as any,
              values: undefined,
            })
          : removeFilter(filterId),
      );
      onChangeRef.current?.({ id: item.id, label: item.label });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setCurrentFilter],
  );

  return (
    <Card className={classes.root}>
      {buttonGroups.map(group => (
        <FilterGroupItem group={group.name} key={group.name}>
          <List disablePadding dense>
            {group.items.map(item => (
              <MenuItem
                key={item.id}
                button
                divider
                onClick={() => setCurrent(item)}
                selected={item.id === currentFilter}
                className={classes.menuItem}
              >
                {item.icon && (
                  <ListItemIcon className={classes.listIcon}>
                    <item.icon fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText>
                  <Typography variant="body1" className={classes.menuTitle}>
                    {item.label}
                  </Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  {/* {getFilterCount(item.id) ?? '-'} */}
                  --
                </ListItemSecondaryAction>
              </MenuItem>
            ))}
          </List>
        </FilterGroupItem>
      ))}
    </Card>
  );
};
