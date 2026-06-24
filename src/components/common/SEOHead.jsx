// src/components/common/SEOHead.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getSEOMetadata } from '../../utils/seoHelpers';

const SEOHead = ({ pageKey }) => {
  const meta = getSEOMetadata(pageKey);

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEOHead;
