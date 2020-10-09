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

import { findPaths } from '@backstage/cli-common';
import { ConfigReader } from '@backstage/config';
import { loadConfig } from '@backstage/config-loader';
import fs from 'fs-extra';
import handlebars from 'handlebars';
import path, { basename } from 'path';
import { MkDocsConfig } from './types';

type Options = {
  directory: string;
  overwrite?: boolean;
};

export async function init({}: Options) {
  // const destination = path.resolve(directory, 'mkdocs.yml');
  // if (!overwrite && fs.existsSync(destination)) {
  //   return;
  // }
  // get config
  // const config = await getConfig();
  // const mkdocsConfig = config.getConfig('techdocs.mkdocs.config');
  // write file
  // await fs.writeFile(destination, contents).catch(error => {
  //   throw new Error(`Failed to create file: ${destination}: ${error.message}`);
  // });
}

// async function getConfig() {
//   const paths = findPaths(__dirname);

//   const appConfigs = await loadConfig({
//     env: process.env.NODE_ENV ?? 'production',
//     rootPaths: [paths.targetRoot, paths.targetDir],
//   });

//   return ConfigReader.fromConfigs(appConfigs);
// }
