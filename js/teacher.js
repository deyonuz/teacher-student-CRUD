let TeacherRow = document.querySelector(".teacher-row");
let TeacherForm = document.querySelector(".teacher-form");
let categoryModal = document.querySelector("#categoryModal");
let modalBtn = document.querySelector(".modal-btn");
let addBtn = document.querySelector("#add-btn");
let paganation = document.querySelector(".pagination");
let serchInput = document.querySelector("#search");

let select = null;
let page = 1;
let search = "";
let order;
let orderMarried
let active = 1;
function getTeacherCard({
  avatar,
  firstName,
  lastName,
  arrgroups,
  isMarri,
  phoneNumber,
  email,
  id,
}) {
  return `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
        <div class="card card-img">
          <img src=${avatar} class="card-img-top" alt="..." />
          <div class="card-body">
            <h3 class="card-title">${firstName}</h3>
            <p class="card-text">${lastName}</p>
            <p class="card-text">${email}</p>
            <div class="groups">
              ${arrgroups ? arrgroups[0] : "N11"}
              guruh
            </div>
            <span class="card-tel">${phoneNumber}</span>
            <h4 class="ismarri">${isMarri ? "Uylangan" : "Uylanmagan"}</h4>
            <button class="btn btn-errr btn-success"
             data-bs-toggle="modal" 
            data-bs-target="#categoryModal"
            onClick= "editTeacher(${id})"
            >
           
            Edit</button>
            <button class="btn btn-danger" 
            onClick= "deletTeacher(${id})"
            >Delete</button>
            <a class="btn button-a btn-primary" href="student.html?teacher=${id}">See Students ${id}</a>
          </div>
        </div>
      </div>`;
}


const selectAdc = document.getElementById("asc-selekt");
// const isMarried = document.getElementById("isMarried");

selectAdc.addEventListener("change", function () {
  const selectedValue = this.value;
  order = selectedValue;

  getTeacher()
});



// isMarried.addEventListener("change", () => {
//   const selectedValue = this.value;
//   orderMarried = selectedValue;
// })



function getTeacher() {
  loaderToggle(true);

  axiosInstance(
    `teacher?page=${page}&limit=${LIMIT}&firstName=${search}&sortBy=firstName&order=${order}`
  )
    .then((res) => {
      let teacher = res.data;

      axiosInstance(`teacher?firstName=${search}`).then((res) => {
        let pages;
        pages = Math.ceil(res.data.length / LIMIT);

        if (pages > 1) {
          paganation.innerHTML = `
          <li onclick="getPage(${page - 1})" ${page === 1 ? "disabled" : ""}
           class="page-item paganation-item"><span class="page-link">Prev</span></li>
          `;

          for (let i = 1; i <= pages; i++) {
            paganation.innerHTML += `
              <li class="page-item ${i == page ? "active" : ""}">
              <button class="page-link" onClick="getPage(${i})">${i}</button>
              </li>
              `;
          }

          paganation.innerHTML += `
            <li    onclick="getPage(${page + 1
            })" class="page-item paganation-item"><span class="page-link">Keyingisi</span></li>
            `;
        } else {
          paganation.innerHTML = "";
        }
      });
      
      TeacherRow.innerHTML = "";

      loaderToggle(false);
      teacher.forEach((teacher) => {
        TeacherRow.innerHTML += getTeacherCard(teacher);
      });
    })
    .catch((err) => {
      alert(err.respon.data);
      loaderToggle(false);
    });
}

function getPage(p) {
  page = p;
  active = page;
  getTeacher();
}

getTeacher();

// teacherform


TeacherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let avatar = TeacherForm.elements.avatar.value;
  let firstName = TeacherForm.elements.firstname.value;

  let gropups = TeacherForm.elements.groups.value;
  let arrgroups = gropups.split(",");

  let email = TeacherForm.elements.email.value;

  let phoneNumber = TeacherForm.elements.number.addEventListener(
    "input",
    function () {
      let inputValue = TeacherForm.elements.number.value;
      let phoneRegex = /^\+998\((87|9[0-9])\)(\d{3}-\d{2}-\d{2})$/;
      let isPhoneValid = phoneRegex.test(inputValue);
      TeacherForm.elements.number.setCustomValidity(
        isPhoneValid
          ? ""
          : "Please enter a valid phone number in the format +998(87)123-45-67."
      );
    }
  );


  let isMarri = TeacherForm.elements.family.checked;

  let lastName = TeacherForm.elements.lastname.value;

  let data = {
    firstName,
    lastName,
    avatar,
    arrgroups,
    isMarri,
    phoneNumber,
    email,
  };

  if (select === null) {
    axiosInstance.post("teacher", data).then((res) => {
      bootstrap.Modal.getInstance(categoryModal).hide();

      getTeacher();
    });
  } else {
    axiosInstance.post(`teacher/${select}`, data).then((res) => {
      bootstrap.Modal.getInstance(categoryModal).hide();
      getTeacher();
    });
  }
});




async function editTeacher(id) {
  select = id;
  let teacher = await axiosInstance(`teacher/${id}`);
  TeacherForm.elements.avatar.value = teacher.data.avatar;
  TeacherForm.elements.lastname.value = teacher.data.lastName;
  TeacherForm.elements.firstname.value = teacher.data.firstName;
  TeacherForm.elements.family.checked = teacher.data.isMarri;
  TeacherForm.elements.email.value = teacher.data.email;
  TeacherForm.elements.number.value = teacher.data.phoneNumber;
  TeacherForm.elements.groups.value = teacher.data.gropups;
  modalBtn.innerHTML = "Save teacher";
}



TeacherForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let avatar = TeacherForm.elements.avatar.value;
  let firstName = TeacherForm.elements.firstname.value;

  let gropups = TeacherForm.elements.groups.value;
  let arrgroups = gropups.split(",");

  let email = TeacherForm.elements.email.value;

  let phoneNumber = TeacherForm.elements.number.addEventListener(
    "input",
    function () {
      let inputValue = TeacherForm.elements.number.value;
      let phoneRegex = /^\+998\((87|9[0-9])\)(\d{3}-\d{2}-\d{2})$/;
      let isPhoneValid = phoneRegex.test(inputValue);
      TeacherForm.elements.number.setCustomValidity(
        isPhoneValid
          ? ""
          : "Please enter a valid phone number in the format +998(87)123-45-67."
      );
    }
  );

  let isMarri = TeacherForm.elements.family.checked;
  let lastName = TeacherForm.elements.lastname.value;

  let data = {
    firstName,
    lastName,
    avatar,
    arrgroups,
    isMarri,
    phoneNumber,
    email,
  };

  if (select === null) {
    axiosInstance.post("teacher", data).then((res) => {
      bootstrap.Modal.getInstance(categoryModal).hide();

      getTeacher();
    });
  } else {
    axiosInstance.put(`teacher/${select}`, data).then((res) => {  // Use PUT request for updating
      bootstrap.Modal.getInstance(categoryModal).hide();
      getTeacher();
    });
  }
});



// ...





addBtn.addEventListener("click", function () {
  select = null;
  modalBtn.innerHTML = "add teacher";
  TeacherForm.reset();
});

async function deletTeacher(id) {
  let check = confirm("Do you want to delete this teacher");

  if (check) {
    await axiosInstance.delete(`teacher/${id}`);
    getTeacher();
  }
}

// search

serchInput.addEventListener("keyup", function () {
  search = this.value;
  getTeacher();
});




