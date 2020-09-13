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

export async function getHtmlDocument(srcBaseUrl: string, path: string) {
  const pathPart = path ? `/${path}` : '';
  const url = `${srcBaseUrl}${pathPart}`;
  const finalUrl =
    url.endsWith('/') || url.endsWith('.html') ? url : `${url}/index.html`;

  const request = await fetch(finalUrl);

  if (request.status === 404) {
    throw new Error('Page not found');
  }

  return request.text();
}

export function buildGetBaseUrl(srcBaseUrl: string) {
  return (oldBaseUrl: string, path: string) => {
    return new URL(oldBaseUrl, `${srcBaseUrl}/${path}`).toString();
  };
}
