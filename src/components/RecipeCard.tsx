import React from 'react';
import type { CollectionEntry } from 'astro:content';

type RecipeCardProps = {
  recipe: CollectionEntry<'recipes'>;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { data } = recipe;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{data.title}</h2>
      <p className="text-gray-600 mb-1">By {data.byline}</p>
      <p className="text-gray-600 mb-4">From {data.location}</p>
      
      <div className="mb-4">
        <p className="text-gray-700 italic">{data.flavor}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
        {data.components.map((component, index) => (
          <div key={index} className="mb-2">
            {Array.isArray(component) ? (
              <ul className="list-disc list-inside ml-4">
                {component.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700">{item}</li>
                ))}
              </ul>
            ) : (
              <h4 className="font-medium text-gray-800">{component}</h4>
            )}
          </div>
        ))}
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Directions</h3>
        <ol className="list-decimal list-inside">
          {data.directions.map((direction, index) => (
            <li key={index} className="text-gray-700 mb-1">{direction}</li>
          ))}
        </ol>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Background</h3>
        <p className="text-gray-700">{data.background}</p>
      </div>
      
      {data.links.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Links</h3>
          <ul className="space-y-1">
            {data.links.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}