import {
    getAllCategoriesAPI,
    getServicesBySubcategoryAPI,
    getSubcategoriesByCategoryAPI,
} from "./api";

// const createSidebarCategories = async function (categoriesBlock: Element) {
//     const categoriesResult = await getAllCategoriesAPI();

//     if (categoriesResult.status === 200) {
//         categoriesBlock.innerHTML = "";

//         categoriesResult.data.data.forEach(async (item: any) => {
//             // Creating category block
//             const categoryBlock = document.createElement("div");
//             categoryBlock.className = "sidebar__category-item";

//             const categoryItem = document.createElement("button");
//             categoryItem.className = "sidebar_category";
//             categoryItem.textContent = item.name;
//             categoryItem.setAttribute("data-id", item.id);

//             // Creating subcategories block
//             const subcategoriesBlock = await createSidebarSubcategories(item.id);

//             categoryBlock.appendChild(categoryItem);
//             categoryBlock.appendChild(subcategoriesBlock);

//             categoriesBlock.appendChild(categoryBlock);
//         });
//     }
// };

const createSidebarSubcategories = async function (categoryId: number) {
    const subcategoriesBlock = document.createElement("div");
    subcategoriesBlock.className = "sidebar__subcategories-block";

    const subcategoriesResult = await getSubcategoriesByCategoryAPI(categoryId);

    if (subcategoriesResult.status === 200) {
        subcategoriesResult.data.data.forEach(async (item: any) => {
            const subcategoryBlock = document.createElement("div");
            subcategoryBlock.className = "sidebar-subcategory-block";

            const subcategoryItem = document.createElement("button");
            subcategoryItem.className = "sidebar-subcategory";
            subcategoryItem.textContent = item.name;
            subcategoryItem.setAttribute("data-id", item.id);
            subcategoryItem.setAttribute("data-visible", "false");

            subcategoryBlock.appendChild(subcategoryItem);
            subcategoriesBlock.appendChild(subcategoryBlock);
        });
    }

    return subcategoriesBlock;
};

const createSidebarServices = async function (subcategoryId: number) {
    const servicesBlock = document.createElement("div");
    servicesBlock.className = "sidebar__services-block";

    const servicesResult = await getServicesBySubcategoryAPI(subcategoryId);

    console.log(servicesResult);

    if (servicesResult.status === 200) {
        servicesResult.data.data.forEach(async (item: any) => {
            const serviceItem = document.createElement("div");
            serviceItem.className = "sidebar-service";

            const serviceInput = document.createElement("input");
            serviceInput.setAttribute("type", "checkbox");
            serviceInput.setAttribute("id", "service_" + item.id);
            serviceInput.setAttribute("data-id", item.id);

            const serviceLabel = document.createElement("label");
            serviceInput.setAttribute("for", "service_" + item.id);
            serviceLabel.textContent = item.name;

            serviceItem.appendChild(serviceInput);
            serviceItem.appendChild(serviceLabel);

            servicesBlock.appendChild(serviceItem);
        });
    }

    return servicesBlock;
};

const sidebarCategoriesBlock = document.querySelectorAll(".sidebar-category");

sidebarCategoriesBlock.forEach(async (categoryItem) => {
    const categoryId = Number(categoryItem.getAttribute("data-id"));
    const subcategoriesBlock = await createSidebarSubcategories(categoryId);
    categoryItem.parentElement.appendChild(subcategoriesBlock);

    // Addin onclick listener
    categoryItem.addEventListener("click", (event) => {
        categoryItem.setAttribute(
            "data-visible",
            categoryItem.getAttribute("data-visible") === "false" ? "true" : "false"
        );

        // Close subcategories
        const subcategories = categoryItem.parentElement.querySelectorAll(".sidebar-subcategory");
        subcategories.forEach((subcategory) => subcategory.setAttribute("data-visible", "false"));
    });

    const subcategories = categoryItem.parentElement.querySelectorAll(".sidebar-subcategory");

    subcategories.forEach(async (subcategoryItem) => {
        const subcategoryId = Number(subcategoryItem.getAttribute("data-id"));
        const servicesBlock = await createSidebarServices(subcategoryId);
        subcategoryItem.parentElement.appendChild(servicesBlock);

        // Addin onclick listener
        subcategoryItem.addEventListener("click", (event) => {
            subcategoryItem.setAttribute(
                "data-visible",
                subcategoryItem.getAttribute("data-visible") === "false" ? "true" : "false"
            );
        });
    });
});
