import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

const DEFAULT_TITLE = 'JR Drogaria - O Melhor Para Você';
const DEFAULT_DESCRIPTION = 'Sua farmácia de confiança com os melhores preços em medicamentos, produtos de higiene, beleza e saúde.';
const BASE_URL = 'https://jrdrogaria.com.br';

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = `${BASE_URL}/og-image.jpg`,
  url,
  type = 'website',
}: SEOProps) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | JR Drogaria` : DEFAULT_TITLE;
    
    document.title = fullTitle;

    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);

    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:type', type, true);
    if (url) updateMetaTag('og:url', `${BASE_URL}${url}`, true);

    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, keywords, image, url, type]);

  return null;
};

export default SEO;
