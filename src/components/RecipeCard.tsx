import React from 'react';
import type { Recipe } from '../interfaces/Recipe';

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return <h1>{recipe.title}</h1>;
}