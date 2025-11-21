import { fetchCategory } from "../api/categories.js";
import { createDom } from "../utils/createDom.js";

function categoyTemplate() {
  return createDom(`
        <div class="categories-container">
        </div>
    `);
}

function categoryItemTemplate(cat) {
  return createDom(`<input type="checkbox" id="${cat.category_name}" name="categories" value="${cat.category_name}">
            <label for="${cat.category_name}">${cat.category_name}</label> `);
}

function CategoryItem(cat) {
  const dom = categoryItemTemplate(cat);

  return dom;
}

export async function Category() {
  const dom = categoyTemplate();
  const categories = dom.querySelector(".categories-container");
  const categoryData = await fetchCategory();

  categoryData.forEach((cat) => {
    categories.append(CategoryItem(cat));
  });

  return dom;
}
