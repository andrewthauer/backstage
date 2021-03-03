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
import { IconComponent } from '@backstage/core';
import { Card, makeStyles, Theme, Typography } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';

export type ButtonGroup = {
  name: string;
  items: {
    id: string;
    label: string;
    icon?: IconComponent;
    filterFn: (entity: Entity) => boolean;
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

type Props = {
  group: string;
};

/**
 * The main filter group in the sidebar, toggling owned/starred/all.
 */
export const FilterGroupItem = ({
  children,
  group,
}: PropsWithChildren<Props>) => {
  const classes = useStyles();

  return (
    <React.Fragment key={group}>
      <Typography variant="subtitle2" className={classes.title}>
        {group}
      </Typography>
      <Card className={classes.groupWrapper}>{children}</Card>
    </React.Fragment>
  );
};
