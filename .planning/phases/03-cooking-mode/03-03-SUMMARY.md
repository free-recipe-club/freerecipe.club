---
phase: 03-cooking-mode
plan: 03
subsystem: validation
tags: [zod, yaml-validation, ingredient-format, superRefine]

requires:
  - phase: 03-cooking-mode
    plan: 02
    provides: Grouped directions schema and simplified cook.tsx without ingredient matching

provides:
  - Zod superRefine on components detecting compound quantity patterns
  - COMPOUND_QTY_RE exported regex for compound quantity detection
  - Corrected pumpkin puree ingredient format using parenthetical sub-quantity

affects: [recipe-authoring, future-recipes]

tech-stack:
  added: []
  patterns:
    - "Zod superRefine for domain-specific validation beyond type checking"
    - "Parenthetical sub-quantities as canonical format: '1 can (15 oz) pumpkin puree'"

key-files:
  created: []
  modified:
    - app/data/recipe-schema.ts
    - data/recipes/pumpkin_doughnut.yml

key-decisions:
  - "Compound quantity regex catches number-unit-unit and number-unit-number-unit patterns"
  - "Regex made the second digit group optional to catch both '1 15 oz can' and '1 tsp 2 oz' variants"
  - "Parenthetical sub-quantities bypass detection since unit is inside parens"

deviations:
  - description: "Task 2 (simplify extractIngredientName regex) skipped entirely"
    reason: "extractIngredientName was deleted in 03-02 refactor — ingredient matching replaced by explicit YAML grouping"
    impact: "No code changes needed in cook.tsx"

patterns-established:
  - "Recipe ingredient validation at authoring time catches ambiguous formats before they reach display code"

requirements-completed: [DISP-10]

duration: 3min
completed: 2026-03-24
