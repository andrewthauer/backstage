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

import React from 'react';
import { useShadowDom } from './hooks';
import { useAsync } from 'react-use';
import { useParams, useNavigate } from 'react-router-dom';
import { Progress } from '../Progress';

import {
  addBaseUrl,
  addLinkClickListener,
  // modifyCss,
  onCssReady,
  rewriteLinks,
  sanitizeDom,
  transform as transformer,
} from './transformers';
import { getHtmlDocument, buildGetBaseUrl } from './utils';

const DocumentNotFound = () => <>Not Found</>;

type Props = {
  srcBaseUrl: string;
  baseUrl?: string;
};

export const ShadowFrame = ({ srcBaseUrl, baseUrl = '' }: Props) => {
  const { '*': routePath } = useParams();
  const path = '';

  const getBaseUrl = buildGetBaseUrl(srcBaseUrl);

  const [shadowDomRef, shadowRoot] = useShadowDom();
  const navigate = useNavigate();

  const { value, loading, error } = useAsync(async () => {
    return getHtmlDocument(srcBaseUrl, path);
  }, [srcBaseUrl, path]);

  React.useEffect(() => {
    if (!shadowRoot || loading || error) {
      return; // Shadow DOM isn't ready / It's not ready / Docs was not found
    }

    // Pre-render
    const transformedElement = transformer(value as string, [
      sanitizeDom(),
      addBaseUrl({
        getBaseUrl,
        path,
      }),
      rewriteLinks(),
      // modifyCss({
      //   cssTransforms: {
      //     '.md-main__inner': [{ 'margin-top': '0' }],
      //     '.md-sidebar': [{ top: '0' }, { width: '20rem' }],
      //     '.md-typeset': [{ 'font-size': '1rem' }],
      //     '.md-nav': [{ 'font-size': '1rem' }],
      //     '.md-grid': [{ 'max-width': '80vw' }],
      //   },
      // }),
    ]);

    if (!transformedElement) {
      return; // An unexpected error occurred
    }

    Array.from(shadowRoot.children).forEach(child =>
      shadowRoot.removeChild(child),
    );
    shadowRoot.appendChild(transformedElement);

    // Post-render
    transformer(shadowRoot.children[0], [
      dom => {
        setTimeout(() => {
          if (window.location.hash) {
            const hash = window.location.hash.slice(1);
            shadowRoot?.getElementById(hash)?.scrollIntoView();
          }
        }, 200);
        return dom;
      },
      addLinkClickListener({
        onClick: (_: MouseEvent, url: string) => {
          const parsedUrl = new URL(url);
          navigate(`${parsedUrl.pathname}${parsedUrl.hash}`);

          shadowRoot?.querySelector(parsedUrl.hash)?.scrollIntoView();
        },
      }),
      onCssReady({
        srcBaseUrl,
        onLoading: (dom: Element) => {
          (dom as HTMLElement).style.setProperty('opacity', '0');
        },
        onLoaded: (dom: Element) => {
          (dom as HTMLElement).style.removeProperty('opacity');
        },
      }),
    ]);
  }, [
    srcBaseUrl,
    getBaseUrl,
    path,
    shadowRoot,
    value,
    error,
    loading,
    navigate,
  ]);

  if (error) {
    return <DocumentNotFound />;
  }

  return (
    <>
      {loading ? <Progress /> : null}
      <div ref={shadowDomRef} />
    </>
  );
};
