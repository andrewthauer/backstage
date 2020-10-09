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

import { Config } from '@backstage/config';
import fs from 'fs-extra';
import handlebars from 'handlebars';
import path from 'path';
import { MkDocsConfig } from './types';

type Options = {
  config: Config;
  templatePath?: string;
};

export async function buildMkDocsConfig({ templatePath, config }: Options) {
  const templateFile =
    templatePath ??
    config.getOptionalString('template') ??
    path.resolve(__dirname, '../../templates/mkdocs.yml.hbs');

  const template = (await fs.readFile(templateFile)).toString();
  const context = buildContext(config.getOptional('data') as MkDocsConfig);
  const compiled = handlebars.compile(template.toString());
  const contents = compiled({ ...context });

  return contents;
}

export function buildContext(config: MkDocsConfig): MkDocsConfig {
  return {
    ...config,
    // siteName
  };
}
