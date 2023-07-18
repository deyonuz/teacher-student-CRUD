const ENDPOINT = 'https://64b3bc9f0efb99d8626852f9.mockapi.io/';
const axiosInstance = axios.create({
  baseURL: ENDPOINT,
  timeout: 17000,
});
const LIMIT = 8;




// validation---------


(() => {
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();



// loading--------------------

const loaderEl = document.querySelector(".loader");

const loaderToggle = (info) => {
  if (info) {
    loaderEl.classList.remove("hidden");
  } else {
    loaderEl.classList.add("hidden");
  }
};





const isMarried = document.querySelector("#category_married");
