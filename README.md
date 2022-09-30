# Welcome to [Free Recipe Club](https://www.freerecipe.club/)

Your always-ad-free source for recipes from the heart.

> 🎃 **Here for Hacktoberfest?** More details are coming. Think about a recipe that means something special to you!

## 🥖 Project Structure

This project uses [Astro](https://astro.build/), as well as React, and Typescript.

Inside the project, the recipes and associated images are placed in the following directories:

```
/
├── public/
│   └── images/
│       └── example_recipe.jpg
├── src/
│   ├── recipes/
│   │   └── example_recipe.yml
```

This website looks for `.yml` files in the `src/recipes/` directory.

The recipe should have a `.jpg` file with a matching name located in the `public/images/` folder.