import { Component } from 'react';
import { Recipe } from '../interfaces/Recipe';

type RecipeCardProps = {
  recipe: Recipe,
};

export class RecipeCard extends Component<RecipeCardProps> {
  render() {
    const { recipe } = this.props;

    return <h1>{recipe.title}</h1>;
  }
}