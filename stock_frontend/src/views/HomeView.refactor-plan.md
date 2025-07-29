# HomeView.vue Componentization and Refactor Plan

## Goal

Break down `HomeView.vue` into reusable, maintainable components without changing any functionality or UI/UX appearance. The result must look and behave exactly as before.

---

## Current Structure Overview

- **Sidebar:** CategorySidebar.vue (already a clean, extracted component)
- **Main Section (`product-section`):**  
  - Entire set of `<section class="category-block">` for each category rendered with a title/heading, divider, and a list of product cards per category.
  - Under each category, a block heading, a divider, then:
    - List of `<ProductCard />` (already a separate component)
    - OR "No products in this category yet!" message

### Main Repeatable UI/Logic areas (`HomeView.vue`)
- **Category block** (for each category):  
  - Heading section (`cat-title` and `cat-divider`),
  - Product list (row flex of cards),
  - "No products in this category" fallback

---

## Identified Opportunities for Extraction

1. **Category Products Section Component**
    - Contains all logic/UI for a single category group/block:  
      - Category heading w/ highlight logic (selectedCategoryId)
      - Divider line, aria-labels
      - List of products via `<ProductCard />`
      - Empty "No products..." message when list is empty
    - Receives:  
      - Category object  
      - List of products for that category  
      - Whether it is the selected category  
      - Ref setter for scrolling/accessibility

    → Candidate name: `CategoryBlock.vue` (suggested location: `src/components/CategoryBlock.vue`)

2. **No Products Fallback Message**  
    - The "No products in this category yet!" is a distinct, styled UI block, can be a functional component if reused elsewhere.
    - Might be inlined within CategoryBlock if unique to it.

3. **Category Heading + Divider**  
    - Current heading (`cat-title`) + divider is visually distinctive, but not reused, only within each `category-block`, so might leave as part of `CategoryBlock.vue` for now.  
    - If needed in other screens (e.g., admin), consider further extraction.

---

## Extraction Plan

1. **Extract CategoryBlock.vue**
    - Inputs:
      - `category`: Category object (id and name)
      - `products`: Product[]
      - `highlighted`: boolean
      - `setCategoryRef`: ref setter function (for scrolling)
    - Emits (if ever needed in future, e.g., admin screens): edit/delete events, but *not needed now*.

    - Handles its own ARIA, tabIndex and scrolling/focus logic via props.

2. **HomeView.vue Updates**
    - Replace category section `<section class="category-block">...</section>` v-for block with `<CategoryBlock ... />` in loop.
    - Still directly renders general error/loading to preserve page structure.
    - Passes all necessary data and functions to child.

3. **Maintain All UI/UX**
    - Carefully preserve all current classes and structure (cat-title, cat-divider, error-box, product-list, no-products, etc.)
    - Keep logic for selected/highlighted category, scroll-into-view, etc.

---

## Summary Table

| UI/Logic                  | File After Refactor             | Notes                         |
|---------------------------|----------------------------------|-------------------------------|
| Sidebar category nav      | CategorySidebar.vue              | Already a component           |
| Category block/heading    | CategoryBlock.vue                | To be extracted               |
| Product display           | ProductCard.vue                  | Already a component           |
| Category error/loading    | HomeView.vue                     | Remains in parent             |
| Empty list fallback       | CategoryBlock.vue (inline)       | Potential for mini component  |

---

## Key Implementation Points

- CategoryBlock must support setting ref for scrolling (pass setCategoryRef, as used in v-for's :ref in HomeView.vue).
- All props and events should be strictly typed (use types/interfaces from HomeView.vue).
- Scoped styles: Move all category-block, cat-title, cat-divider, product-list, no-products, and relevant responsive rules from HomeView.vue to CategoryBlock.vue.
- No visual, ARIA or accessibility changes should occur.
- Public interface (JSDoc) and prop documentation required.

---

## Plan Summary (Steps)

1. Extract CategoryBlock.vue, with prop interface and required slots/structure.
2. Move relevant HTML, styles, and logic from HomeView.vue to CategoryBlock.vue (including ARIA attributes).
3. Replace category block v-for in HomeView.vue with new component.
4. Test to verify *pixel-perfect* match with prior implementation (manual or automated).
5. Document all changes and update HomeView.refactor-plan.md.

---

## (Optional for the future)

- If admin/editor screens need category or product grouping, reuse these new components.
- If "no products" message is used elsewhere, consider a global EmptyState.vue.

---

End of plan.
